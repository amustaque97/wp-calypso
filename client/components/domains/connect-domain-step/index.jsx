/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { createElement, createInterpolateElement } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { connect } from 'react-redux';
import page from 'page';
import { BackButton } from '@automattic/onboarding';

/**
 * Internal dependencies
 */
import { modeType, stepType, defaultDomainSetupInfo } from './constants';
import ConnectDomainStepSuggested from './connect-domain-step-suggested';
import ConnectDomainStepAdvanced from './connect-domain-step-advanced';
import ConnectDomainStepDone from './connect-domain-step-done';
import DomainTransferRecommendation from 'calypso/components/domains/domain-transfer-recommendation';
import { Gridicon } from 'calypso/devdocs/design/playground-scope';
import {
	MAP_DOMAIN_CHANGE_NAME_SERVERS,
	MAP_EXISTING_DOMAIN_UPDATE_A_RECORDS,
} from 'calypso/lib/url/support';
import wp from 'calypso/lib/wp';
import FormattedHeader from 'calypso/components/formatted-header';
import { getSelectedSite } from 'calypso/state/ui/selectors';
import { domainMapping } from 'calypso/my-sites/domains/paths';
import { isMappingVerificationSuccess } from './connect-domain-step-verification-status-parsing.js';

/**
 * Style dependencies
 */
import './style.scss';

function ConnectDomainStep( { domain, selectedSite } ) {
	const [ mode, setMode ] = useState( modeType.NAME_SERVERS );
	const [ step, setStep ] = useState( stepType.START );
	const [ prev, setPrev ] = useState( [] );
	const [ verificationStatus, setVerificationStatus ] = useState( {} );
	const [ verificationInProgress, setVerificationInProgress ] = useState( false );
	const [ domainSetupInfo, setDomainSetupInfo ] = useState( defaultDomainSetupInfo );
	const [ domainSetupInfoError, setDomainSetupInfoError ] = useState( {} );
	const [ loadingDomainSetupInfo, setLoadingDomainSetupInfo ] = useState( false );

	const baseClassName = 'connect-domain-step';

	const stepsComponent = {
		[ modeType.NAME_SERVERS ]: ConnectDomainStepSuggested,
		[ modeType.A_RECORDS ]: ConnectDomainStepAdvanced,
		[ modeType.DONE ]: ConnectDomainStepDone,
	};

	const supportLink = {
		[ modeType.NAME_SERVERS ]: MAP_DOMAIN_CHANGE_NAME_SERVERS,
		[ modeType.A_RECORDS ]: MAP_EXISTING_DOMAIN_UPDATE_A_RECORDS,
	};

	const wpcom = wp.undocumented();

	const setNextStep = ( nextStep ) => {
		setPrev( [ ...prev, { mode, step } ] );
		setStep( nextStep );
	};

	const setNextMode = ( nextMode ) => {
		setPrev( [ ...prev, { mode, step } ] );
		setMode( nextMode );
	};

	const verifyConnection = () => {
		setVerificationStatus( {} );
		setVerificationInProgress( true );
		wpcom
			.getMappingStatus( domain )
			.then( ( data ) => {
				setVerificationStatus( { data } );
				if ( isMappingVerificationSuccess( mode, data ) ) {
					setNextMode( modeType.DONE );
					setNextStep( stepType.CONNECTED );
				} else {
					setNextMode( modeType.DONE );
					setNextStep( stepType.VERIFYING );
				}
			} )
			.catch( ( error ) => {
				setVerificationStatus( { error } );
				setNextMode( modeType.DONE );
				setNextStep( stepType.VERIFYING );
			} )
			.then( () => setVerificationInProgress( false ) );
	};

	const goBack = () => {
		const last = prev.pop();

		if ( last ) {
			setMode( last.mode );
			setStep( last.step );
			setPrev( prev || [] );
		} else {
			page( domainMapping( selectedSite.slug, domain ) );
		}
	};

	const hasLoadedDomainSetupInfo = useRef( null );
	useEffect( () => {
		if ( domain === hasLoadedDomainSetupInfo.current || loadingDomainSetupInfo ) {
			return;
		}

		const loadDomainSetupInfo = () => {
			setDomainSetupInfoError( {} );
			setLoadingDomainSetupInfo( true );
			hasLoadedDomainSetupInfo.current = domain;
			wpcom
				.getMappingSetupInfo( selectedSite.ID, domain )
				.then( ( data ) => setDomainSetupInfo( { data } ) )
				.catch( ( error ) => setDomainSetupInfoError( { error } ) )
				.then( () => setLoadingDomainSetupInfo( false ) );
		};
		loadDomainSetupInfo();
	}, [ domain, domainSetupInfo, loadingDomainSetupInfo, selectedSite.ID ] );

	const StepsComponent = stepsComponent[ mode ];
	const isStepStart = stepType.START === step;

	const supportInfo = (
		<div className={ baseClassName + '__support-documentation' }>
			<Gridicon
				className={ baseClassName + '__support-documentation-info-icon' }
				icon="help-outline"
				size={ 16 } /* eslint-disable-line */
			/>{ ' ' }
			{ /* eslint-disable-line */ }
			<span className={ baseClassName + '__text' }>
				{ createInterpolateElement(
					__( 'Not finding your way? You can read our detailed <a>support documentation</a>.' ),
					{
						a: createElement( 'a', { href: supportLink[ mode ], target: '_blank' } ),
					}
				) }
			</span>
		</div>
	);

	const headerText = sprintf(
		/* translators: %s: domain name being connected (ex.: example.com) */
		__( 'Connect %s' ),
		domain
	);

	return (
		<>
			<BackButton className={ baseClassName + '__go-back' } onClick={ goBack }>
				<Gridicon icon="arrow-left" size={ 18 } />
				{ __( 'Back' ) }
			</BackButton>
			<FormattedHeader
				brandFont
				className={ baseClassName + '__page-heading' }
				headerText={ headerText }
				align="left"
			/>
			<StepsComponent
				className={ baseClassName }
				domain={ domain }
				step={ step }
				mode={ mode }
				onChangeStep={ setNextStep }
				onChangeMode={ setNextMode }
				onVerifyConnection={ verifyConnection }
				verificationInProgress={ verificationInProgress }
				verificationStatus={ verificationStatus || {} }
				domainSetupInfo={ domainSetupInfo }
				domainSetupInfoError={ domainSetupInfoError }
			/>
			{ isStepStart && <DomainTransferRecommendation /> }
			{ supportInfo }
		</>
	);
}

ConnectDomainStep.propTypes = {
	domain: PropTypes.string.isRequired,
	selectedSite: PropTypes.object,
};

export default connect( ( state ) => ( { selectedSite: getSelectedSite( state ) } ) )(
	ConnectDomainStep
);
