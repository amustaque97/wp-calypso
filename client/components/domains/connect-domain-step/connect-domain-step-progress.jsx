/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Gridicon from 'calypso/components/gridicon';

/**
 * Style dependencies
 */
import './style.scss';

export default function ConnectDomainStepProgress( { steps, currentStep } ) {
	let currentStepNumber = 0;

	return (
		<div className="connect-domain-step__progress">
			{ Object.values( steps )
				.map( ( stepName, index ) => {
					const stepNumber = index + 1;
					if ( stepName === steps[ currentStep ] ) {
						currentStepNumber = stepNumber;
					}

					const stepCompleted = 0 === currentStepNumber || currentStepNumber > stepNumber;

					const stepNumberClasses = classNames( 'connect-domain-step__progress-number', {
						'current-step': currentStepNumber === stepNumber,
						'completed-step': stepCompleted,
					} );

					const stepNumberContent = stepCompleted ? (
						<Gridicon icon="checkmark" size={ 16 } /> /* eslint-disable-line */
					) : (
						stepNumber
					);

					return (
						<React.Fragment key={ 'step-' + stepNumber }>
							<span className={ stepNumberClasses }>{ stepNumberContent }</span>
							<span className="connect-domain-step__progress-step-name">{ stepName }</span>
						</React.Fragment>
					);
				} )
				.reduce( ( list, element, index ) => {
					return list === null
						? [ element ]
						: [
								...list,
								// eslint-disable-next-line wpcalypso/jsx-gridicon-size
								<Gridicon key={ 'icon-' + index } icon="chevron-right" size={ 20 } />,
								element,
						  ];
				}, null ) }
		</div>
	);
}

ConnectDomainStepProgress.propTypes = {
	steps: PropTypes.object.isRequired,
	currentStep: PropTypes.string.isRequired,
};

/* eslint-disable-next-line wpcalypso/jsx-gridicon-size */
// <Gridicon icon="chevron-right" size={ 20 } />
