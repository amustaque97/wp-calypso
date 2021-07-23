/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { createElement, createInterpolateElement } from '@wordpress/element';
import { Card } from '@automattic/components';

/**
 * Internal dependencies
 */
import { modeType, stepType } from './constants';
import CardHeading from 'calypso/components/card-heading';
import ConnectDomainStepProgress from './connect-domain-step-progress';

/**
 * Style dependencies
 */
import './style.scss';

const progressStepList = [ stepType.LOG_IN_TO_PROVIDER, stepType.UPDATE_A_RECORDS ];

export default function ConnectDomainStepAdvanced( {
	className,
	domain,
	step,
	onChangeStep,
	onChangeMode,
} ) {
	const setModeSuggested = () => onChangeMode( modeType.NAME_SERVERS );
	const StepsProgress = (
		<ConnectDomainStepProgress steps={ progressStepList } currentStep={ step } />
	);
	const showProgress = progressStepList.includes( step );

	return (
		<Card className={ className }>
			<CardHeading className="connect-domain-step__heading">Advanced setup</CardHeading>
			{ showProgress && StepsProgress }
			<p>
				{ createInterpolateElement(
					__(
						'This is the advanced way to connect your domain, using root A & CNAME records. We advise using our <a>suggested setup</a> instead, with WordPress.com name servers.'
					),
					{
						a: createElement( 'a', {
							className: 'connect-domain-step__change_mode_link',
							onClick: setModeSuggested,
						} ),
					}
				) }
			</p>
		</Card>
	);
}

ConnectDomainStepAdvanced.propTypes = {
	className: PropTypes.string,
	domain: PropTypes.string.isRequired,
	step: PropTypes.oneOf( Object.values( stepType ) ).isRequired,
	onChangeStep: PropTypes.func.isRequired,
	onChangeMode: PropTypes.func.isRequired,
	stepProgress: PropTypes.instanceOf( ConnectDomainStepProgress ),
	onVerifyConnection: PropTypes.func.isRequired,
	verificationStatus: PropTypes.object.isRequired,
};
