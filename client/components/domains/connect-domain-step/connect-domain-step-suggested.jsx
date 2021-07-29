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
import { modeType, stepType } from './constants';
import CardHeading from 'calypso/components/card-heading';
import ConnectDomainStepSuggestedStart from './connect-domain-step-suggested-start';
import ConnectDomainStepLogin from './connect-domain-step-login';
import ConnectDomainStepSuggestedRecords from './connect-domain-step-suggested-records';
import ConnectDomainStepProgress from './connect-domain-step-progress';

/**
 * Style dependencies
 */
import './style.scss';

const stepContent = {
	[ stepType.START ]: ConnectDomainStepSuggestedStart,
	[ stepType.LOG_IN_TO_PROVIDER ]: ConnectDomainStepLogin,
	[ stepType.UPDATE_NAME_SERVERS ]: ConnectDomainStepSuggestedRecords,
};

const progressStepList = {
	[ stepType.LOG_IN_TO_PROVIDER ]: __( 'Log in to provider' ),
	[ stepType.UPDATE_NAME_SERVERS ]: __( 'Update name servers' ),
};

export default function ConnectDomainStepSuggested( {
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
			<CardHeading className={ className + '__heading' }>{ __( 'Suggested setup' ) }</CardHeading>
			{ showProgress && StepsProgress }
			<StepContent
				baseClassName={ className }
				domain={ domain }
				mode={ mode }
				onChangeMode={ onChangeMode }
				onChangeStep={ onChangeStep }
				stepProgress={ showProgress && StepsProgress }
				onVerifyConnection={ onVerifyConnection }
				updateStep={ stepType.UPDATE_NAME_SERVERS }
				verificationInProgress={ verificationInProgress }
				verificationStatus={ verificationStatus }
				domainSetupInfo={ domainSetupInfo }
			/>
		</Card>
	);
}

ConnectDomainStepSuggested.propTypes = {
	className: PropTypes.string,
	domain: PropTypes.string.isRequired,
	step: PropTypes.oneOf( Object.values( stepType ) ).isRequired,
	mode: PropTypes.oneOf( Object.values( modeType ) ).isRequired,
	onChangeStep: PropTypes.func.isRequired,
	onChangeMode: PropTypes.func.isRequired,
	onVerifyConnection: PropTypes.func.isRequired,
	verificationInProgress: PropTypes.bool,
	verificationStatus: PropTypes.object.isRequired,
	domainSetupInfo: PropTypes.object.isRequired,
};
