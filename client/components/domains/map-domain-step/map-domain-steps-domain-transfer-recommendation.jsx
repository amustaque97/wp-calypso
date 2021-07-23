/**
 * External dependencies
 */
import React from 'react';
import { __ } from '@wordpress/i18n';
import { Button, Card } from '@automattic/components';
import Badge from 'calypso/components/badge';

/**
 * Internal dependencies
 */
import CardHeading from 'calypso/components/card-heading';
import { INCOMING_DOMAIN_TRANSFER } from 'calypso/lib/url/support';

/**
 * Style dependencies
 */
import './style.scss';

export default function DomainTransferRecommendation() {
	return (
		<Card className="map-domain-step__transfer-recommendation">
			<div className="map-domain-step__transfer-recommendation-content">
				<CardHeading size={ 16 }>
					{ __( 'Transfer your domain' ) }
					<Badge type="info-green">{ __( 'Recommended' ) }</Badge>
				</CardHeading>
				<span className="map-domain-step__transfer-recommendation-message">
					{ __(
						'We recommend transferring your domain to manage your domain and site directly on WordPress.com'
					) }
				</span>
			</div>
			<Button
				className="map-domain-step__transfer-recommendation-action"
				href={ INCOMING_DOMAIN_TRANSFER }
			>
				{ __( 'Transfer instead' ) }
			</Button>
		</Card>
	);
}
