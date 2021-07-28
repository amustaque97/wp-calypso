/**
 * Internal dependencies
 */
import debugFactory from 'debug';
import { convertTempResponseCartToResponseCart } from './cart-functions';
import { createRequestCartProducts } from './create-request-cart-product';
import { getEmptyResponseCart } from './empty-carts';
import { createCartSyncMiddleware, createCartInitMiddleware } from './sync';
import { getInitialShoppingCartState, shoppingCartReducer } from './use-shopping-cart-reducer';
import type {
	GetCartFunction,
	SetCartFunction,
	ShoppingCartManagerClient,
	ShoppingCartManagerWrapper,
	ShoppingCartManager,
	RequestCart,
	ShoppingCartAction,
	ShoppingCartState,
	SubscribeCallback,
	UnsubscribeFunction,
	AddProductsToCart,
	ReplaceProductsInCart,
	RemoveProductFromCart,
	ReplaceProductInCart,
	UpdateTaxLocationInCart,
	ApplyCouponToCart,
	RemoveCouponFromCart,
	ReloadCartFromServer,
	ResponseCart,
	RequestCartProduct,
	ShoppingCartActionCreators,
	ShoppingCartManagerSubscribe,
} from './types';

const debug = debugFactory( 'shopping-cart:shopping-cart-manager' );

function createManager(
	state: ShoppingCartState,
	lastValidResponseCart: ResponseCart,
	actionCreators: ShoppingCartActionCreators,
	subscribe: ShoppingCartManagerSubscribe
): ShoppingCartManager {
	const { cacheStatus, queuedActions, couponStatus, loadingErrorType, loadingError } = state;
	const isLoading = cacheStatus === 'fresh' || cacheStatus === 'fresh-pending';
	const isPendingUpdate = queuedActions.length > 0 || cacheStatus !== 'valid';
	const loadingErrorForManager = cacheStatus === 'error' ? loadingError : null;
	debug(
		'manager isLoading',
		isLoading,
		'isPendingUpdate',
		isPendingUpdate,
		'loadingError',
		loadingErrorForManager
	);

	return {
		subscribe,
		...actionCreators,
		isLoading,
		loadingError: loadingErrorForManager,
		loadingErrorType,
		isPendingUpdate,
		couponStatus,
		responseCart: lastValidResponseCart,
	};
}

function createManagerWrapper(
	cartKey: string,
	getCart: GetCartFunction,
	setCart: SetCartFunction
): ShoppingCartManagerWrapper {
	let state = getInitialShoppingCartState();

	let lastCacheStatus = '';

	const setServerCart = ( cartParam: RequestCart ) => setCart( String( cartKey ), cartParam );
	const getServerCart = () => getCart( String( cartKey ) );

	const syncCartToServer = createCartSyncMiddleware( setServerCart );
	const initializeCartFromServer = createCartInitMiddleware( getServerCart );
	const middleware = [ initializeCartFromServer, syncCartToServer ];

	let subscribedClients: SubscribeCallback[] = [];
	const subscribe = ( callback: SubscribeCallback ): UnsubscribeFunction => {
		debug( `adding subscriber for cartKey ${ cartKey }` );
		subscribedClients.push( callback );
		return () => {
			debug( `removing subscriber for cartKey ${ cartKey }` );
			subscribedClients = subscribedClients.filter( ( prevCallback ) => prevCallback !== callback );
		};
	};
	const notifySubscribers = () => {
		debug( `notifying ${ subscribedClients.length } subscribers for cartKey ${ cartKey }` );
		subscribedClients.forEach( ( clientCallback ) => clientCallback() );
	};

	const checkStatus = () => {
		const { cacheStatus } = state;
		debug( 'cache status before status check functions is', cacheStatus );
		fetchInitialCart();
		updateLastValidResponseCart();
		resolveActionPromisesIfValid();
		prepareInvalidCartForSync();
		playQueuedActions();
		debug( 'running status check functions complete' );
	};

	const dispatchWithMiddleware = ( action: ShoppingCartAction ) => {
		debug( `heard action request for cartKey ${ cartKey }`, action.type );
		setTimeout( () => {
			debug( `dispatching middleware action for cartKey ${ cartKey }`, action.type );
			middleware.forEach( ( middlewareFn ) => {
				middlewareFn( action, state, dispatchWithMiddleware );
			} );
			debug( `dispatching action for cartKey ${ cartKey }`, action.type );
			state = shoppingCartReducer( state, action );
			checkStatus();
			notifySubscribers();
			lastCacheStatus = state.cacheStatus;
		} );
	};

	function fetchInitialCart(): void {
		const { cacheStatus } = state;
		if ( cacheStatus === 'fresh' && cacheStatus !== lastCacheStatus ) {
			debug( 'triggering fetch of initial cart' );
			dispatchWithMiddleware( { type: 'FETCH_INITIAL_RESPONSE_CART' } );
			dispatchWithMiddleware( { type: 'GET_CART_FROM_SERVER' } );
		}
	}

	function prepareInvalidCartForSync(): void {
		const { queuedActions, cacheStatus } = state;
		if (
			queuedActions.length === 0 &&
			cacheStatus === 'invalid' &&
			cacheStatus !== lastCacheStatus
		) {
			debug( 'triggering sync of cart to server' );
			dispatchWithMiddleware( { type: 'REQUEST_UPDATED_RESPONSE_CART' } );
			dispatchWithMiddleware( { type: 'SYNC_CART_TO_SERVER' } );
		}
	}

	const { responseCart: initialResponseCart } = state;
	let lastValidResponseCart = convertTempResponseCartToResponseCart( initialResponseCart );
	function updateLastValidResponseCart(): void {
		const { queuedActions, cacheStatus, responseCart: tempResponseCart } = state;
		if ( queuedActions.length === 0 && cacheStatus === 'valid' ) {
			const responseCart = convertTempResponseCartToResponseCart( tempResponseCart );
			lastValidResponseCart = responseCart;
		}
	}

	let actionPromises: ( ( cart: ResponseCart ) => void )[] = [];
	function resolveActionPromisesIfValid(): void {
		const { queuedActions, cacheStatus, responseCart: tempResponseCart } = state;
		if ( queuedActions.length === 0 && cacheStatus === 'valid' && actionPromises.length > 0 ) {
			debug( `resolving ${ actionPromises.length } action promises` );
			const responseCart = convertTempResponseCartToResponseCart( tempResponseCart );
			actionPromises.forEach( ( callback ) => callback( responseCart ) );
			actionPromises = [];
		}
	}

	function dispatchAndWaitForValid( action: ShoppingCartAction ): Promise< ResponseCart > {
		return new Promise< ResponseCart >( ( resolve ) => {
			dispatchWithMiddleware( action );
			actionPromises.push( resolve );
		} );
	}

	function playQueuedActions(): void {
		const { queuedActions, cacheStatus } = state;
		if ( queuedActions.length > 0 && cacheStatus === 'valid' ) {
			debug( 'cart is loaded; playing queued actions', queuedActions );
			dispatchWithMiddleware( { type: 'CLEAR_QUEUED_ACTIONS' } );
			queuedActions.forEach( ( action: ShoppingCartAction ) => {
				dispatchWithMiddleware( action );
			} );
			debug( 'cart is loaded; queued actions are dispatched' );
		}
	}

	const removeCoupon: RemoveCouponFromCart = () =>
		dispatchAndWaitForValid( { type: 'REMOVE_COUPON' } );
	const addProductsToCart: AddProductsToCart = ( products ) =>
		dispatchAndWaitForValid( {
			type: 'CART_PRODUCTS_ADD',
			products: createRequestCartProducts( products ),
		} );
	const removeProductFromCart: RemoveProductFromCart = ( uuidToRemove ) =>
		dispatchAndWaitForValid( { type: 'REMOVE_CART_ITEM', uuidToRemove } );
	const replaceProductsInCart: ReplaceProductsInCart = ( products ) =>
		dispatchAndWaitForValid( {
			type: 'CART_PRODUCTS_REPLACE_ALL',
			products: createRequestCartProducts( products ),
		} );
	const replaceProductInCart: ReplaceProductInCart = (
		uuidToReplace: string,
		productPropertiesToChange: Partial< RequestCartProduct >
	) =>
		dispatchAndWaitForValid( {
			type: 'CART_PRODUCT_REPLACE',
			uuidToReplace,
			productPropertiesToChange,
		} );
	const updateLocation: UpdateTaxLocationInCart = ( location ) =>
		dispatchAndWaitForValid( { type: 'SET_LOCATION', location } );
	const applyCoupon: ApplyCouponToCart = ( newCoupon ) =>
		dispatchAndWaitForValid( { type: 'ADD_COUPON', couponToAdd: newCoupon } );
	const reloadFromServer: ReloadCartFromServer = () =>
		dispatchAndWaitForValid( { type: 'CART_RELOAD' } );
	const actionCreators = {
		reloadFromServer,
		applyCoupon,
		updateLocation,
		replaceProductInCart,
		replaceProductsInCart,
		removeProductFromCart,
		addProductsToCart,
		removeCoupon,
	};

	let cachedManager = createManager( state, lastValidResponseCart, actionCreators, subscribe );
	let lastState = state;

	function getManager(): ShoppingCartManager {
		if ( lastState !== state ) {
			cachedManager = createManager( state, lastValidResponseCart, actionCreators, subscribe );
			lastState = state;
		}
		return cachedManager;
	}

	// Kick off initial actions
	checkStatus();

	return {
		getManager,
	};
}

const emptyCart = getEmptyResponseCart();

const noopManager: ShoppingCartManager = {
	subscribe: () => () => null,
	isLoading: true,
	loadingError: undefined,
	loadingErrorType: undefined,
	isPendingUpdate: true,
	couponStatus: 'fresh',
	addProductsToCart: ( products ) => ( products ? Promise.resolve( emptyCart ) : Promise.reject() ),
	removeProductFromCart: ( uuid ) => ( uuid ? Promise.resolve( emptyCart ) : Promise.reject() ),
	applyCoupon: ( coupon ) => ( coupon ? Promise.resolve( emptyCart ) : Promise.reject() ),
	removeCoupon: () => Promise.resolve( emptyCart ),
	updateLocation: ( location ) => ( location ? Promise.resolve( emptyCart ) : Promise.reject() ),
	replaceProductInCart: () => Promise.resolve( emptyCart ),
	replaceProductsInCart: () => Promise.resolve( emptyCart ),
	reloadFromServer: () => Promise.resolve( emptyCart ),
	responseCart: emptyCart,
};

export function createShoppingCartManagerClient( {
	getCart,
	setCart,
}: {
	getCart: GetCartFunction;
	setCart: SetCartFunction;
} ): ShoppingCartManagerClient {
	const managerWrappersByCartKey: Record< string, ShoppingCartManagerWrapper > = {};

	function forCartKey( cartKey: string | undefined ): ShoppingCartManager {
		if ( ! cartKey ) {
			return noopManager;
		}

		if ( ! managerWrappersByCartKey[ cartKey ] ) {
			debug( `creating cart manager for "${ cartKey }"` );
			managerWrappersByCartKey[ cartKey ] = createManagerWrapper( cartKey, getCart, setCart );
		}

		return managerWrappersByCartKey[ cartKey ].getManager();
	}

	return {
		forCartKey,
		subscribeToCartKey: ( cartKey: string, callback ) =>
			forCartKey( cartKey ).subscribe( callback ),
	};
}
