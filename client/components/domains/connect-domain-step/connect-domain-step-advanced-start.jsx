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
import Notice from 'calypso/components/notice';
import NoticeAction from 'calypso/components/notice/notice-action';

/**
 * Style dependencies
 */
import './style.scss';

export default function ConnectDomainStepSuggestedStart( {
	baseClassName,
	onChangeMode,
	onChangeStep,
} ) {
	const setModeSuggested = () => onChangeMode( modeType.NAME_SERVERS );
	const setStepLogin = () => onChangeStep( stepType.LOG_IN_TO_PROVIDER );

	return (
		<>
			<Notice
				className={ baseClassName + '__advanced-start-notice' }
				status="is-warning"
				showDismiss={ false }
			>
				{ __(
					'We advise using our recommended setup instead, with WordPress.com name servers. Our advanced setup requires manually managing DNS records for any added services such as Professional Email yourself.'
				) }
				<NoticeAction onClick={ setModeSuggested }>
					{ __( 'Back to recommended setup' ) }
				</NoticeAction>
			</Notice>
			<div className={ baseClassName + '__suggested-start' }>
				<p className={ baseClassName + '__text' }>
					{ createInterpolateElement(
						__(
							'This is the advanced way to connect your domain, using root A records & CNAME records. We advise using our <a>suggested setup</a> instead, with WordPress.com name servers.'
						),
						{
							a: createElement( 'a', {
								className: 'connect-domain-step__change_mode_link',
								onClick: setModeSuggested,
							} ),
						}
					) }
				</p>
				<CardHeading className={ baseClassName + '__sub-heading' }>
					<MaterialIcon
						className={ baseClassName + '__sub-heading-icon' }
						size={ 24 }
						icon="timer"
					/>
					{ __( 'How long will it take?' ) }
				</CardHeading>
				<p className={ baseClassName + '__text' }>
					{ __( 'It takes 5 minutes to set up.' ) }
					<br />
					{ __( 'It can take up to 72 hours for the domain to be fully connected.' ) }
				</p>
				<Button primary onClick={ setStepLogin }>
					{ __( 'Start setup' ) }
				</Button>
			</div>
		</>
	);
}

ConnectDomainStepSuggestedStart.propTypes = {
	baseClassName: PropTypes.string.isRequired,
	onChangeStep: PropTypes.func.isRequired,
	onChangeMode: PropTypes.func.isRequired,
};
