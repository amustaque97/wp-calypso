/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { createElement, createInterpolateElement } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { connect } from 'react-redux';
import page from 'page';
import { BackButton } from '@automattic/onboarding';

/**
 * Internal dependencies
 */
import { modeType, stepType } from './constants';
import ConnectDomainStepSuggested from './connect-domain-step-suggested';
import ConnectDomainStepAdvanced from './connect-domain-step-advanced';
import ConnectDomainStepDone from './connect-domain-step-done';
import DomainTransferRecommendation from 'calypso/components/domains/domain-transfer-recommendation';
import { Gridicon } from 'calypso/devdocs/design/playground-scope';
import {
	MAP_DOMAIN_CHANGE_NAME_SERVERS,
	MAP_EXISTING_DOMAIN_UPDATE_A_RECORDS,
} from 'calypso/lib/url/support';
import wp from 'calypso/lib/wp';
import FormattedHeader from 'calypso/components/formatted-header';
import { getSelectedSiteSlug } from 'calypso/state/ui/selectors';
import { domainMapping } from 'calypso/my-sites/domains/paths';

/**
 * Style dependencies
 */
import './style.scss';

const stepsComponent = {
	[ modeType.NAME_SERVERS ]: ConnectDomainStepSuggested,
	[ modeType.A_RECORDS ]: ConnectDomainStepAdvanced,
	[ modeType.DONE ]: ConnectDomainStepDone,
};

const supportLink = {
	[ modeType.NAME_SERVERS ]: MAP_DOMAIN_CHANGE_NAME_SERVERS,
	[ modeType.A_RECORDS ]: MAP_EXISTING_DOMAIN_UPDATE_A_RECORDS,
};

const wpcom = wp.undocumented();

function ConnectDomainStep( { domain, selectedSiteSlug } ) {
	const [ mode, setMode ] = useState( modeType.NAME_SERVERS );
	const [ step, setStep ] = useState( stepType.START );
	const [ prev, setPrev ] = useState( [] );
	const [ verificationStatus, setVerificationStatus ] = useState( {} );
	const [ verificationInProgress, setVerificationInProgress ] = useState( false );

	const verifyConnection = () => {
		setVerificationStatus( {} );
		setVerificationInProgress( true );
		wpcom
			.getMappingStatus( domain )
			.then( ( data ) => setVerificationStatus( { data } ) )
			.catch( ( error ) => setVerificationStatus( { error } ) )
			.then( () => setVerificationInProgress( false ) );
	};

	const goBack = () => {
		const last = prev.pop();

		if ( last ) {
			setMode( last.mode );
			setStep( last.step );
			setPrev( prev || [] );
		} else {
			page( domainMapping( selectedSiteSlug, domain ) );
		}
	};

	const setNextStep = ( nextStep ) => {
		setPrev( [ ...prev, { mode, step } ] );
		setStep( nextStep );
	};

	const setNextMode = ( nextMode ) => {
		setPrev( [ ...prev, { mode, step } ] );
		setMode( nextMode );
	};

	const StepsComponent = stepsComponent[ mode ];
	const isStepStart = stepType.START === step;

	const supportInfo = (
		<div className="connect-domain-step__support-documentation">
			<Gridicon icon="help-outline" size={ 16 } /> { /* eslint-disable-line */ }
			<span className="connect-domain-step__text">
				{ createInterpolateElement(
					__( 'Not finding your way? You can read our detailed <a>support documentation</a>.' ),
					{
						a: createElement( 'a', { href: supportLink[ mode ], target: '_blank' } ),
					}
				) }
			</span>
		</div>
	);

	console.log( prev );

	const headerText = sprintf(
		/* translators: %s: domain name being connected (ex.: example.com) */
		__( 'Connect %s' ),
		domain
	);

	return (
		<>
			<BackButton className="connect-domain-step__go-back" onClick={ goBack }>
				<Gridicon icon="arrow-left" size={ 18 } />
				{ __( 'Back' ) }
			</BackButton>
			<FormattedHeader
				brandFont
				className="connect-domain-step__page-heading"
				headerText={ headerText }
				align="left"
			/>
			<StepsComponent
				className="connect-domain-step"
				domain={ domain }
				step={ step }
				mode={ mode }
				onChangeStep={ setNextStep }
				onChangeMode={ setNextMode }
				onVerifyConnection={ verifyConnection }
				verificationInProgress={ verificationInProgress }
				verificationStatus={ verificationStatus || {} }
			/>
			{ isStepStart && <DomainTransferRecommendation /> }
			{ supportInfo }
		</>
	);
}

ConnectDomainStep.propTypes = {
	domain: PropTypes.string.isRequired,
	selectedSiteSlug: PropTypes.string,
};

export default connect( ( state ) => ( { selectedSiteSlug: getSelectedSiteSlug( state ) } ) )(
	ConnectDomainStep
);
