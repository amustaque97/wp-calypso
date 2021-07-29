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
import { modeType } from './constants';
import ConnectDomainStepClipboardButton from './connect-domain-step-clipboard-button';
import ConnectDomainStepVerificationNotice from './connect-domain-step-verification-error-notice';

/**
 * Style dependencies
 */
import './style.scss';

export default function ConnectDomainStepSuggestedRecords( {
	baseClassName,
	mode,
	onVerifyConnection,
	verificationInProgress,
	verificationStatus,
	domainSetupInfo,
} ) {
	const { data } = domainSetupInfo;
	const { wpcom_name_servers: nameServers } = data;

	return (
		<div className={ baseClassName + '__suggested-records' }>
			<ConnectDomainStepVerificationNotice
				mode={ mode }
				verificationStatus={ verificationStatus }
			/>
			<p className={ baseClassName + '__text' }>
				{ __( 'Find the name servers on your domain’s settings page.' ) }
				<br />
				{ __( 'Replace all the name servers of your domain to use the following values:' ) }
			</p>
			<div className={ baseClassName + '__records-list' }>
				{ nameServers.map( ( nameServer ) => {
					return (
						<div key={ nameServer } className={ baseClassName + '__records-list-record' }>
							<div className={ baseClassName + '__records-list-record-item' }>
								<ConnectDomainStepClipboardButton
									baseClassName={ baseClassName }
									text={ nameServer }
								/>
							</div>
						</div>
					);
				} ) }
			</div>
			<p className={ baseClassName + '__text' }>
				{ __( 'Once you\'ve updated the name servers click on "Verify Connection" below.' ) }
			</p>
			<div className={ baseClassName + '__actions' }>
				<Button
					primary
					onClick={ onVerifyConnection }
					disabled={ verificationInProgress }
					busy={ verificationInProgress }
				>
					{ __( 'Verify Connection' ) }
				</Button>
			</div>
		</div>
	);
}

ConnectDomainStepSuggestedRecords.propTypes = {
	baseClassName: PropTypes.string.isRequired,
	mode: PropTypes.oneOf( Object.values( modeType ) ).isRequired,
	onVerifyConnection: PropTypes.func.isRequired,
	verificationInProgress: PropTypes.bool,
	verificationStatus: PropTypes.object.isRequired,
	domainSetupInfo: PropTypes.object.isRequired,
};
