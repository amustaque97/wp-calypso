/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import { __ } from '@wordpress/i18n';
import { createElement, createInterpolateElement } from '@wordpress/element';
import { Button } from '@automattic/components';
import MaterialIcon from 'calypso/components/material-icon';

/**
 * Internal dependencies
 */
import { modeType, stepType } from './constants';
import CardHeading from 'calypso/components/card-heading';

/**
 * Style dependencies
 */
import './style.scss';

export default function ConnectDomainStepSuggestedStart( {
	baseClassName,
	onChangeMode,
	onChangeStep,
} ) {
	const setModeAdvanced = () => onChangeMode( modeType.A_RECORDS );
	const setStepLogin = () => onChangeStep( stepType.LOG_IN_TO_PROVIDER );

	return (
		<div className={ baseClassName + '__suggested-start' }>
			<p className={ baseClassName + '__text' }>
				{ createInterpolateElement(
					__(
						'This is the easiest way to connect your domain, using name servers. If needed you can also use our <a>advanced setup</a>, using root A & CNAME records.'
					),
					{
						a: createElement( 'a', {
							className: 'connect-domain-step__change_mode_link',
							onClick: setModeAdvanced,
						} ),
					}
				) }
			</p>
			<CardHeading className={ baseClassName + '__sub-heading' }>
				<MaterialIcon className={ baseClassName + '__sub-heading-icon' } size={ 24 } icon="timer" />
				{ __( 'How long will it take?' ) }
			</CardHeading>
			<p className={ baseClassName + '__text' }>
				{ __( 'It takes 5-15 minutes to set up.' ) }
				<br />
				{ __( 'It can take up to 72 hours for the domain to be fully connected.' ) }
			</p>
			<Button primary onClick={ setStepLogin }>
				{ __( 'Start setup' ) }
			</Button>
		</div>
	);
}

ConnectDomainStepSuggestedStart.propTypes = {
	baseClassName: PropTypes.string.isRequired,
	onChangeStep: PropTypes.func.isRequired,
	onChangeMode: PropTypes.func.isRequired,
};
