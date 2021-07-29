/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@automattic/components';
import classNames from 'classnames';

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

export default function ConnectDomainStepAdvancedRecords( {
	baseClassName,
	domain,
	mode,
	onVerifyConnection,
	verificationInProgress,
	verificationStatus,
	domainSetupInfo,
} ) {
	const { data } = domainSetupInfo;
	const { default_ip_addresses: ipAddresses } = data;
	const recordLabels = {
		type: __( 'Type' ),
		name: __( 'Name' ),
		value: __( 'Value' ),
	};
	const aRecords = ipAddresses.map( ( ipAddress ) => {
		return {
			type: 'A',
			name: domain,
			value: ipAddress,
		};
	} );
	const cnameRecords = [
		{
			type: 'CNAME',
			name: 'www',
			value: domain,
		},
	];

	const itemClasses = {
		type: [ baseClassName + '__records-list-record-item', 'type' ],
		name: [ baseClassName + '__records-list-record-item', 'name' ],
		value: [ baseClassName + '__records-list-record-item', 'value' ],
	};

	const itemClassNames = {
		type: classNames( itemClasses.type ),
		name: classNames( itemClasses.name ),
		value: classNames( itemClasses.value ),
	};

	const recordsListHeader = (
		<div className={ baseClassName + '__records-list-header' }>
			{ Object.entries( recordLabels ).map( ( [ key, value ] ) => (
				<div
					key={ key }
					className={ classNames(
						baseClassName + '__records-list-record-label',
						...itemClasses[ key ]
					) }
				>
					{ value }
				</div>
			) ) }
		</div>
	);

	const renderRecordsListItems = ( recordsList ) => {
		return recordsList.map( ( record, index ) => {
			return (
				<div key={ 'record-' + index } className={ baseClassName + '__records-list-record' }>
					{ Object.entries( record ).map( ( [ key, value ] ) => {
						if ( 'type' === key ) {
							return (
								<div key={ 'record-item' + key + '-' + index } className={ itemClassNames.type }>
									<div className={ baseClassName + '__records-list-record-label' }>
										{ recordLabels.type }
									</div>
									{ value }
								</div>
							);
						}
						return (
							<div key={ 'record-item' + key + '-' + index } className={ itemClassNames[ key ] }>
								<div className={ baseClassName + '__records-list-record-label' }>
									{ recordLabels[ key ] }
								</div>
								<ConnectDomainStepClipboardButton baseClassName={ baseClassName } text={ value } />
							</div>
						);
					} ) }
				</div>
			);
		} );
	};

	const renderRecordsList = ( recordsList ) => (
		<div className={ baseClassName + '__records-list' }>
			{ recordsListHeader }
			{ renderRecordsListItems( recordsList ) }
		</div>
	);

	return (
		<div className={ baseClassName + '__advanced-records' }>
			<ConnectDomainStepVerificationNotice
				mode={ mode }
				verificationStatus={ verificationStatus }
			/>
			<p className={ baseClassName + '__text' }>
				{ __( 'Find the root A records on your domain’s settings page.' ) }
				<br />
				{ __( 'Replace IP addresses (A records) of your domain to use the following values:' ) }
			</p>
			{ renderRecordsList( aRecords ) }
			<p className={ baseClassName + '__text' }>
				{ __( 'Next fnd the CNAME records on your domain’s settings page.' ) }
				<br />
				{ __( 'Replace the "www" CNAME record of your domain to use the following values:' ) }
			</p>
			{ renderRecordsList( cnameRecords ) }
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

ConnectDomainStepAdvancedRecords.propTypes = {
	baseClassName: PropTypes.string.isRequired,
	domain: PropTypes.string.isRequired,
	mode: PropTypes.oneOf( Object.values( modeType ) ).isRequired,
	onVerifyConnection: PropTypes.func.isRequired,
	verificationInProgress: PropTypes.bool,
	verificationStatus: PropTypes.object.isRequired,
	domainSetupInfo: PropTypes.object.isRequired,
};
