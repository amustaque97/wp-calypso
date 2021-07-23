/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { createElement, createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { modeType, stepType } from './constants';
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

/**
 * Style dependencies
 */
import './style.scss';

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

export default function ConnectDomainStep( { domain } ) {
	const [ mode, setMode ] = useState( modeType.NAME_SERVERS );
	const [ step, setStep ] = useState( stepType.START );
	const [ verificationStatus, setVerificationStatus ] = useState( {} );
	const [ verificationInProgress, setVerificationInProgress ] = useState( false );

	const verifyConnection = () => {
		setVerificationStatus( {} );
		setVerificationInProgress( true );
		wpcom
			.getMappingStatus( domain )
			.then( ( data ) => setVerificationStatus( { data } ) )
			.catch( ( error ) => setVerificationStatus( { error } ) )
			.then( () => setVerificationInProgress( false ) );
	};

	const StepsComponent = stepsComponent[ mode ];
	const isStepStart = stepType.START === step;

	const supportInfo = (
		<div className="connect-domain-step__support-documentation">
			<Gridicon icon="help-outline" size={ 16 } /> { /* eslint-disable-line */ }
			<span className="connect-domain-step__text">
				{ createInterpolateElement(
					__( 'Not finding your way? You can read our detailed <a>support documentation</a>.' ),
					{
						a: createElement( 'a', { href: supportLink[ mode ], target: '_blank' } ),
					}
				) }
			</span>
		</div>
	);

	return (
		<>
			<StepsComponent
				className="connect-domain-step"
				domain={ domain }
				step={ step }
				mode={ mode }
				onChangeStep={ setStep }
				onChangeMode={ setMode }
				onVerifyConnection={ verifyConnection }
				verificationInProgress={ verificationInProgress }
				verificationStatus={ verificationStatus || {} }
			/>
			{ isStepStart && <DomainTransferRecommendation /> }
			{ supportInfo }
		</>
	);
}

ConnectDomainStep.propTypes = {
	domain: PropTypes.string.isRequired,
};
