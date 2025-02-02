import { SIGNUP_STEPS_SITE_STYLE_SET } from 'calypso/state/action-types';
import { setSiteStyle } from '../actions';

describe( 'setSiteStyle()', () => {
	test( 'should return the expected action object', () => {
		const siteStyle = 'humongous';

		expect( setSiteStyle( siteStyle ) ).toEqual( {
			type: SIGNUP_STEPS_SITE_STYLE_SET,
			siteStyle,
		} );
	} );
} );
