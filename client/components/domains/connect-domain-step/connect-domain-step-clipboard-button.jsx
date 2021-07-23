/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import ClipboardButton from 'calypso/components/forms/clipboard-button';
import Gridicon from 'calypso/components/gridicon';

/**
 * Style dependencies
 */
import './style.scss';

export default function ConnectDomainStepClipboardButton( { text } ) {
	const [ copiedText, setCopiedText ] = useState( false );
	const copied = () => setCopiedText( true );
	const stateClasses = classNames( 'connect-domain-step__clipboard-button-state', {
		'connect-domain-step__clipboard-button-blue': ! copiedText,
	} );
	const dataClasses = classNames(
		'connect-domain-step__clipboard-button-data',
		'connect-domain-step__clipboard-button-text'
	);

	return (
		<ClipboardButton
			className="connect-domain-step__clipboard-button"
			text={ text }
			onCopy={ copied }
			borderless
		>
			<span className={ dataClasses }>{ text }</span>
			<div className={ stateClasses }>
				{ /* eslint-disable-next-line wpcalypso/jsx-gridicon-size */ }
				<Gridicon icon="next-page" size={ 20 } />
				<span className="connect-domain-step__clipboard-button-text">
					{ copiedText ? __( 'Copied!' ) : __( 'Copy' ) }
				</span>
			</div>
		</ClipboardButton>
	);
}

ConnectDomainStepClipboardButton.propTypes = {
	text: PropTypes.string.isRequired,
};
