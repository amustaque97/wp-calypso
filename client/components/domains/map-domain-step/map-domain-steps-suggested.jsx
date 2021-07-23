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
import MapDomainStepSuggestedStart from './map-domain-steps-suggested-start';
import MapDomainStepSuggestedLogin from './map-domain-steps-suggested-login';
import MapDomainStepSuggestedNameServers from './map-domain-steps-suggested-name-servers';
import MapDomainStepsProgress from './map-domain-steps-progress';

/**
 * Style dependencies
 */
import './style.scss';

const stepContent = {
	[ stepType.START ]: MapDomainStepSuggestedStart,
	[ stepType.LOG_IN_TO_PROVIDER ]: MapDomainStepSuggestedLogin,
	[ stepType.UPDATE_NAME_SERVERS ]: MapDomainStepSuggestedNameServers,
};

const progressStepList = {
	[ stepType.LOG_IN_TO_PROVIDER ]: __( 'Log in to provider' ),
	[ stepType.UPDATE_NAME_SERVERS ]: __( 'Update name servers' ),
};

export default function MapDomainStepsSuggested( {
	className,
	domain,
	step,
	onChangeStep,
	onChangeMode,
	onVerifyConnection,
	verificationInProgress,
	verificationStatus,
} ) {
	const StepContent = stepContent[ step ];
	const StepsProgress = <MapDomainStepsProgress steps={ progressStepList } currentStep={ step } />;
	const showProgress = Object.keys( progressStepList ).includes( step );

	return (
		<Card className={ className }>
			<CardHeading className="map-domain-step__heading">{ __( 'Suggested setup' ) }</CardHeading>
			{ showProgress && StepsProgress }
			<StepContent
				domain={ domain }
				onChangeMode={ onChangeMode }
				onChangeStep={ onChangeStep }
				stepProgress={ showProgress && StepsProgress }
				onVerifyConnection={ onVerifyConnection }
				verificationInProgress={ verificationInProgress }
				verificationStatus={ verificationStatus }
			/>
		</Card>
	);
}

MapDomainStepsSuggested.propTypes = {
	className: PropTypes.string,
	domain: PropTypes.string.isRequired,
	step: PropTypes.oneOf( Object.values( stepType ) ).isRequired,
	onChangeStep: PropTypes.func.isRequired,
	onChangeMode: PropTypes.func.isRequired,
	onVerifyConnection: PropTypes.func.isRequired,
	verificationInProgress: PropTypes.bool,
	verificationStatus: PropTypes.object.isRequired,
};
