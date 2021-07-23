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
import MapDomainStepsProgress from 'calypso/components/domains/map-domain-step/map-domain-steps-progress';

/**
 * Style dependencies
 */
import './style.scss';

const progressStepList = [ stepType.LOG_IN_TO_PROVIDER, stepType.UPDATE_A_RECORDS ];

export default function MapDomainStepsAdvanced( {
	className,
	domain,
	step,
	onChangeStep,
	onChangeMode,
} ) {
	const setModeSuggested = () => onChangeMode( modeType.NAME_SERVERS );
	const StepsProgress = <MapDomainStepsProgress steps={ progressStepList } currentStep={ step } />;
	const showProgress = progressStepList.includes( step );

	return (
		<Card className={ className }>
			<CardHeading className="map-domain-step__heading">Advanced setup</CardHeading>
			{ showProgress && StepsProgress }
			<p>
				{ createInterpolateElement(
					__(
						'This is the advanced way to connect your domain, using root A & CNAME records. We advise using our <a>suggested setup</a> instead, with WordPress.com name servers.'
					),
					{
						a: createElement( 'a', {
							className: 'map-domain-step__change_mode_link',
							onClick: setModeSuggested,
						} ),
					}
				) }
			</p>
		</Card>
	);
}

MapDomainStepsAdvanced.propTypes = {
	className: PropTypes.string,
	domain: PropTypes.string.isRequired,
	step: PropTypes.oneOf( Object.values( stepType ) ).isRequired,
	onChangeStep: PropTypes.func.isRequired,
	onChangeMode: PropTypes.func.isRequired,
	stepProgress: PropTypes.instanceOf( MapDomainStepsProgress ),
	onVerifyConnection: PropTypes.func.isRequired,
	verificationStatus: PropTypes.object.isRequired,
};
