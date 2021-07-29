/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import { __ } from '@wordpress/i18n';
import { Card } from '@automattic/components';

/**
 * Internal dependencies
 */
import { stepType } from './constants';
import CardHeading from 'calypso/components/card-heading';
import ConnectDomainStepAdvancedStart from './connect-domain-step-advanced-start';
import ConnectDomainStepLogin from './connect-domain-step-login';
import ConnectDomainStepAdvancedRecords from './connect-domain-step-advanced-records';
import ConnectDomainStepProgress from './connect-domain-step-progress';

/**
 * Style dependencies
 */
import './style.scss';

const stepContent = {
	[ stepType.START ]: ConnectDomainStepAdvancedStart,
	[ stepType.LOG_IN_TO_PROVIDER ]: ConnectDomainStepLogin,
	[ stepType.UPDATE_A_RECORDS ]: ConnectDomainStepAdvancedRecords,
};

const progressStepList = {
	[ stepType.LOG_IN_TO_PROVIDER ]: __( 'Log in to provider' ),
	[ stepType.UPDATE_A_RECORDS ]: __( 'Update root A records & CNAME record' ),
};

export default function ConnectDomainStepAdvanced( {
	className,
	domain,
	step,
	mode,
	onChangeStep,
	onChangeMode,
	onVerifyConnection,
	verificationInProgress,
	verificationStatus,
	domainSetupInfo,
} ) {
	const StepContent = stepContent[ step ];
	const StepsProgress = (
		<ConnectDomainStepProgress
			baseClassName={ className }
			steps={ progressStepList }
			currentStep={ step }
		/>
	);
	const showProgress = Object.keys( progressStepList ).includes( step );

	return (
		<Card className={ className }>
			<CardHeading className={ className + '__heading' }>{ __( 'Advanced setup' ) }</CardHeading>
			{ showProgress && StepsProgress }
			<StepContent
				baseClassName={ className }
				domain={ domain }
				mode={ mode }
				onChangeMode={ onChangeMode }
				onChangeStep={ onChangeStep }
				stepProgress={ showProgress && StepsProgress }
				onVerifyConnection={ onVerifyConnection }
				updateStep={ stepType.UPDATE_A_RECORDS }
				verificationInProgress={ verificationInProgress }
				verificationStatus={ verificationStatus }
				domainSetupInfo={ domainSetupInfo }
			/>
		</Card>
	);
}

ConnectDomainStepAdvanced.propTypes = {
	className: PropTypes.string.isRequired,
	domain: PropTypes.string.isRequired,
	step: PropTypes.oneOf( Object.values( stepType ) ).isRequired,
	onChangeStep: PropTypes.func.isRequired,
	onChangeMode: PropTypes.func.isRequired,
	stepProgress: PropTypes.instanceOf( ConnectDomainStepProgress ),
	onVerifyConnection: PropTypes.func.isRequired,
	verificationStatus: PropTypes.object.isRequired,
	domainSetupInfo: PropTypes.object.isRequired,
};
