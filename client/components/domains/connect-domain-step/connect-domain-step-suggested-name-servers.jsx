/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@automattic/components';

/**
 * Internal dependencies
 */
import { modeType, stepType } from './constants';
import ConnectDomainStepClipboardButton from './connect-domain-step-clipboard-button';
import ConnectDomainStepVerificationNotice from './connect-domain-step-verification-error-notice';

/**
 * Style dependencies
 */
import './style.scss';

export default function ConnectDomainStepSuggestedNameServers( {
	mode,
	onChangeStep,
	onChangeMode,
	onVerifyConnection,
	verificationInProgress,
	verificationStatus,
} ) {
	const continueWithoutVerifying = () => {
		onChangeMode( modeType.DONE );
		onChangeStep( stepType.VERIFYING );
	};
	const nameServers = [ 'ns1.wordpress.com', 'ns2.wordpress.com', 'ns3.wordpress.com' ];

	return (
		<div className="connect-domain-step__suggested-login">
			<ConnectDomainStepVerificationNotice
				mode={ mode }
				verificationStatus={ verificationStatus }
			/>
			<p className="connect-domain-step__text">
				{ __( 'Find the name servers on your domain’s settings page.' ) }
				<br />
				{ __( 'Replace all the name servers of your domain to use the following values:' ) }
			</p>
			<div className="connect-domain-step__name-server-list">
				{ nameServers.map( ( nameServer ) => {
					return <ConnectDomainStepClipboardButton key={ nameServer } text={ nameServer } />;
				} ) }
			</div>
			<p className="connect-domain-step__text">
				{ __( 'Once you\'ve updated the name servers click on "Verify Connection" below.' ) }
			</p>
			<div className="connect-domain-step__actions">
				<Button
					primary
					onClick={ onVerifyConnection }
					disabled={ verificationInProgress }
					busy={ verificationInProgress }
				>
					{ __( 'Verify Connection' ) }
				</Button>
				<Button
					onClick={ continueWithoutVerifying }
					disabled={ verificationInProgress }
					busy={ verificationInProgress }
				>
					{ __( 'Finish setup later' ) }
				</Button>
			</div>
		</div>
	);
}

ConnectDomainStepSuggestedNameServers.propTypes = {
	domain: PropTypes.string.isRequired,
	mode: PropTypes.oneOf( Object.values( modeType ) ).isRequired,
	onChangeStep: PropTypes.func.isRequired,
	onChangeMode: PropTypes.func.isRequired,
	onVerifyConnection: PropTypes.func.isRequired,
	verificationInProgress: PropTypes.bool,
	verificationStatus: PropTypes.object.isRequired,
};
