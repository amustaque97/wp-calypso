/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { createElement, createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Notice from 'calypso/components/notice';
import { modeType } from 'calypso/components/domains/connect-domain-step/constants';

/**
 * Style dependencies
 */
import './style.scss';

function getErrorMessage( mode, verificationStatus ) {
	const { data, error } = verificationStatus;

	if ( ! data && ! error ) {
		return;
	}

	const {
		has_wpcom_nameservers: HasWpcomNameservers,
		has_wpcom_ip_addresses: HasWpcomIpAddresses,
		has_cloudflare_ip_addresses: HasCloudflareIpAddresses,
		resolves_to_wpcom: ResolvesToWpcom,
		host_ip_addresses: HostIpAddresses,
		name_servers: NameServers,
	} = data || {};

	const genericError = __( "We couldn't verify the connection for your domain, please try again." );

	if ( error ) {
		return error?.message || genericError;
	}

	if ( ResolvesToWpcom || HasWpcomIpAddresses || HasWpcomNameservers ) {
		return;
	}

	if ( HasCloudflareIpAddresses ) {
		return __(
			'Your domain appears to be set up with Cloudflare, but does not resolve to WordPress.com'
		);
	}

	if ( modeType.NAME_SERVERS === mode && false === HasWpcomNameservers ) {
		if ( NameServers.length === 0 ) {
			return __( "We couldn't retrieve the name servers for your domain. Please try again." );
		}

		return createInterpolateElement(
			sprintf(
				/* translators: %s: the list of name servers. (Ex.: "ns1.example, ns2.example.com") */
				__(
					'The name servers for your domain are set to: <em>%s</em>. Please try this step again.'
				),
				NameServers.join( ', ' )
			),
			{ em: createElement( 'em' ) }
		);
	}

	if ( modeType.A_RECORDS === mode ) {
		if ( HostIpAddresses.length === 0 ) {
			return __( "We couldn't retrieve the A records for your domain. Please try again." );
		}

		return createInterpolateElement(
			sprintf(
				/* translators: %s: the list of IP addresses. (Ex.: "192.168.0.1, 192.168.0.2") */
				__(
					'The name A records for your domain are set to: <em>%s</em>. Please try this step again.'
				),
				HostIpAddresses.join( ', ' )
			),
			{ em: createElement( 'em' ) }
		);
	}

	return genericError;
}

export default function ConnectDomainStepVerificationNotice( { mode, verificationStatus } ) {
	const errorMessage = getErrorMessage( mode, verificationStatus ) || null;

	if ( ! errorMessage ) {
		return null;
	}

	return (
		<Notice status="is-error" showDismiss={ false }>
			{ errorMessage }
		</Notice>
	);
}

ConnectDomainStepVerificationNotice.propTypes = {
	mode: PropTypes.oneOf( Object.values( modeType ) ).isRequired,
	verificationStatus: PropTypes.object.isRequired,
};
