/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { createElement, createInterpolateElement } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { modeType, stepType } from './constants';
import MapDomainStepsSuggested from 'calypso/components/domains/map-domain-step/map-domain-steps-suggested';
import MapDomainStepsAdvanced from 'calypso/components/domains/map-domain-step/map-domain-steps-advanced';
import DomainTransferRecommendation from './map-domain-steps-domain-transfer-recommendation';
import { Gridicon } from 'calypso/devdocs/design/playground-scope';
import {
	MAP_DOMAIN_CHANGE_NAME_SERVERS,
	MAP_EXISTING_DOMAIN_UPDATE_A_RECORDS,
} from 'calypso/lib/url/support';
import wp from 'calypso/lib/wp';

/**
 * Style dependencies
 */
import './style.scss';

const stepsComponent = {
	[ modeType.NAME_SERVERS ]: MapDomainStepsSuggested,
	[ modeType.A_RECORDS ]: MapDomainStepsAdvanced,
};

const supportLink = {
	[ modeType.NAME_SERVERS ]: MAP_DOMAIN_CHANGE_NAME_SERVERS,
	[ modeType.A_RECORDS ]: MAP_EXISTING_DOMAIN_UPDATE_A_RECORDS,
};

const wpcom = wp.undocumented();

export default function MapDomainStep( { domain } ) {
	const [ mode, setMode ] = useState( modeType.NAME_SERVERS );
	const [ step, setStep ] = useState( stepType.START );
	const [ verificationStatus, setVerificationStatus ] = useState( {} );
	const [ verificationInProgress, setVerificationInProgress ] = useState( false );

	const verifyConnection = () => {
		setVerificationStatus( {} );
		setVerificationInProgress( true );
		wpcom
			.getMappingStatus( domain )
			.then(
				( data ) => {
					if (
						data.resolves_to_wpcom ||
						data.has_wpcom_ip_addresses ||
						data.has_wpcom_nameservers
					) {
						setVerificationStatus( { success: true } );
						return;
					}

					if ( data.has_cloudflare_ip_addresses ) {
						setVerificationStatus( {
							error: __(
								'Your domain appears to be set up with Cloudflare, but does not resolve to WordPress.com'
							),
						} );
						return;
					}

					if ( modeType.NAME_SERVERS === mode && false === data.has_wpcom_nameservers ) {
						if ( data.name_servers.length === 0 ) {
							setVerificationStatus( {
								error: __(
									"We couldn't retrieve the name servers for your domain. Please try again."
								),
							} );
							return;
						}

						setVerificationStatus( {
							error: createInterpolateElement(
								sprintf(
									/* translators: %s: the list of name servers. (Ex.: "ns1.example, ns2.example.com") */
									__(
										'The name servers for your domain are set to: <em>%s</em>. Please try this step again.'
									),
									data.name_servers.join( ', ' )
								),
								{ em: createElement( 'em' ) }
							),
						} );
						return;
					}

					if ( modeType.A_RECORDS === mode && false === data.has_wpcom_ip_addresses ) {
						if ( data.has_wpcom_ip_addresses.length === 0 ) {
							setVerificationStatus( {
								error: __(
									"We couldn't retrieve the name servers for your domain. Please try again."
								),
							} );
							return;
						}

						setVerificationStatus( {
							error: createInterpolateElement(
								sprintf(
									/* translators: %s: the list of name servers. (Ex.: "ns1.example, ns2.example.com") */
									__(
										'The name A records for your domain are set to: <em>%s</em>. Please try this step again.'
									),
									data.host_ip_addresses.join( ', ' )
								),
								{ em: createElement( 'em' ) }
							),
						} );
						return;
					}

					setVerificationStatus( {
						error: __( "We couldn't verify the connection for your domain, please try again." ),
					} );
				},
				() => {
					setVerificationStatus( {
						error: __( "We couldn't verify the status of your domain, please try again later." ),
					} );
				}
			)
			.then( () => {
				setVerificationInProgress( false );
			} );
	};

	const StepsComponent = stepsComponent[ mode ];
	const isStepStart = stepType.START === step;

	const supportInfo = (
		<div className="map-domain-step__support-documentation">
			<Gridicon icon="help-outline" size={ 16 } /> { /* eslint-disable-line */ }
			<span className="map-domain-step__text">
				{ createInterpolateElement(
					__( 'Not finding your way? You can read our detailed <a>support documentation</a>.' ),
					{
						a: createElement( 'a', { href: supportLink[ mode ], target: '_blank' } ),
					}
				) }
			</span>
		</div>
	);

	return (
		<>
			<StepsComponent
				className="map-domain-step"
				domain={ domain }
				step={ step }
				onChangeStep={ setStep }
				onChangeMode={ setMode }
				onVerifyConnection={ verifyConnection }
				verificationInProgress={ verificationInProgress }
				verificationStatus={ verificationStatus || {} }
			/>
			{ isStepStart && <DomainTransferRecommendation /> }
			{ supportInfo }
		</>
	);
}

MapDomainStep.propTypes = {
	domain: PropTypes.string.isRequired,
};

MapDomainStep.defaultProps = {
	domain: 'foo.org',
};
