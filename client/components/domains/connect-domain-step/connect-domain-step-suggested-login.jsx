/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@automattic/components';
import { createElement, createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { stepType } from './constants';

/**
 * Style dependencies
 */
import './style.scss';

export default function ConnectDomainStepSuggestedLogin( { domain, onChangeStep } ) {
	const setStepUpdateDns = () => onChangeStep( stepType.UPDATE_NAME_SERVERS );

	return (
		<div className="connect-domain-step__suggested-login">
			<p className="connect-domain-step__text">
				{ createInterpolateElement(
					__(
						'Log into your domain provider account (like GoDaddy, NameCheap, 1&1, etc.) If you can’t remember who this is: go to <a>this link</a>, enter your domain and look at <em>Reseller Information</em> or <em>Registrar</em> to see the name of your provider.'
					),
					{
						em: createElement( 'em' ),
						a: createElement( 'a', { href: 'https://lookup.icann.org', target: '_blank' } ),
					}
				) }
			</p>
			<p className="connect-domain-step__text">
				{ sprintf(
					/* translators: %s: the domain name that the user is connecting to WordPress.com (ex.: example.com) */
					__(
						'On your domain provider’s site go to the domains page. Find %s and go to it’s settings page.'
					),
					domain
				) }
			</p>
			<Button primary onClick={ setStepUpdateDns }>
				{ __( "I found the domain's setup page" ) }
			</Button>
		</div>
	);
}

ConnectDomainStepSuggestedLogin.propTypes = {
	domain: PropTypes.string.isRequired,
	onChangeStep: PropTypes.func.isRequired,
};
