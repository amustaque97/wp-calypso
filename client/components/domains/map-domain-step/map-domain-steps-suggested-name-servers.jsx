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
import { stepType } from './constants';
import MapDomainStepsClipboardButton from './map-domain-steps-clipboard-button';
import Notice from 'calypso/components/notice';

/**
 * Style dependencies
 */
import './style.scss';

export default function MapDomainStepSuggestedNameServers( {
	domain,
	onChangeStep,
	onChangeMode,
	onVerifyConnection,
	verificationInProgress,
	verificationStatus,
} ) {
	const continueWithoutVerifying = () => onChangeStep( stepType.DONE );
	const nameServers = [ 'ns1.wordpress.com', 'ns2.wordpress.com', 'ns3.wordpress.com' ];
	const verificationError = verificationStatus?.error;

	return (
		<div className="map-domain-step__suggested-login">
			{ verificationError && (
				<Notice status="is-error" showDismiss={ false }>
					{ verificationError }
				</Notice>
			) }
			<p className="map-domain-step__text">
				{ __( 'Find the name servers on your domain’s settings page.' ) }
				<br />
				{ __( 'Replace all the name servers of your domain to use the following values:' ) }
			</p>
			<div className="map-domain-step__name-server-list">
				{ nameServers.map( ( nameServer ) => {
					return <MapDomainStepsClipboardButton key={ nameServer } text={ nameServer } />;
				} ) }
			</div>
			<p className="map-domain-step__text">
				{ __( 'Once you\'ve updated the name servers click on "Verify Connection" below.' ) }
			</p>
			<div className="map-domain-step__actions">
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

MapDomainStepSuggestedNameServers.propTypes = {
	domain: PropTypes.string.isRequired,
	onChangeStep: PropTypes.func.isRequired,
	onChangeMode: PropTypes.func.isRequired,
	onVerifyConnection: PropTypes.func.isRequired,
	verificationInProgress: PropTypes.bool,
	verificationStatus: PropTypes.object.isRequired,
};
