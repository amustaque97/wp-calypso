import { get } from 'lodash';
import { addQueryArgs } from 'calypso/lib/route';
import { getEditedPost } from 'calypso/state/posts/selectors';
import { getPreference } from 'calypso/state/preferences/selectors';
import getEditorUrl from 'calypso/state/selectors/get-editor-url';
import { getSiteSlug } from 'calypso/state/sites/selectors';

import 'calypso/state/editor/init';

/**
 * Returns the current editor post ID, or `null` if a new post.
 *
 * @param  {object} state Global state tree
 * @returns {?number}      Current editor post ID
 */
export function getEditorPostId( state ) {
	return state.editor.postId;
}

/**
 * Returns whether editing a new post in the post editor.
 *
 * @param  {object}  state Global state tree
 * @returns {boolean}       Whether editing new post in editor
 */
export function isEditorNewPost( state ) {
	return ! getEditorPostId( state );
}

/**
 * Returns the editor URL for duplicating a given site ID, post ID pair.
 *
 * @param  {object} state       Global state tree
 * @param  {number} siteId      Site ID
 * @param  {number} postId      Post ID
 * @param  {string} type        Post type
 * @returns {string}             Editor URL path
 */
export function getEditorDuplicatePostPath( state, siteId, postId, type = 'post' ) {
	return addQueryArgs(
		{
			'jetpack-copy': postId,
		},
		getEditorUrl( state, siteId, null, type )
	);
}

/**
 * Returns the editor new post URL path for the given site ID and type.
 *
 * @param  {object} state       Global state tree
 * @param  {number} siteId      Site ID
 * @param  {number} type        Post type
 * @returns {string}             Editor URL path
 */
export function getEditorNewPostPath( state, siteId, type = 'post' ) {
	let path;
	switch ( type ) {
		case 'post':
			path = '/post';
			break;
		case 'page':
			path = '/page';
			break;
		default:
			path = `/edit/${ type }`;
			break;
	}

	const siteSlug = getSiteSlug( state, siteId );
	if ( siteSlug ) {
		path += `/${ siteSlug }`;
	} else {
		path += `/${ siteId }`;
	}

	return path;
}

/**
 * Returns the editor URL path for the given site ID, post ID pair.
 *
 * @param  {object} state       Global state tree
 * @param  {number} siteId      Site ID
 * @param  {number} postId      Post ID
 * @param  {string} defaultType Fallback post type if post not found
 * @returns {string}             Editor URL path
 */
export function getEditorPath( state, siteId, postId, defaultType = 'post' ) {
	if ( ! siteId ) {
		return 'post';
	}
	const editedPost = getEditedPost( state, siteId, postId );
	const type = get( editedPost, 'type', defaultType );
	let path = getEditorNewPostPath( state, siteId, type );

	if ( postId ) {
		path += `/${ postId }`;
	}

	return path;
}

/**
 * Returns whether the confirmation sidebar is enabled for the given siteId
 *
 * @param  {object}  state     Global state tree
 * @param  {number}  siteId    Site ID
 * @returns {boolean}           Whether or not the sidebar is enabled
 */
export function isConfirmationSidebarEnabled( state, siteId ) {
	return getPreference( state, 'editorConfirmationDisabledSites' ).indexOf( siteId ) === -1;
}

export function isEditorIframeLoaded( state ) {
	return state.editor.isIframeLoaded;
}

export function getEditorIframePort( state ) {
	return state.editor.iframePort;
}
