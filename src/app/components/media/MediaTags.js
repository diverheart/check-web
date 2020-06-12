import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';
import Relay from 'react-relay/classic';
import mergeWith from 'lodash.mergewith';
import xor from 'lodash.xor';
import styled from 'styled-components';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import Can from '../Can';
import UpdateLanguageMutation from '../../relay/mutations/UpdateLanguageMutation';
import LanguageSelector from '../LanguageSelector';
import { searchQueryFromUrl, urlFromSearchQuery } from '../search/Search';
import { withSetFlashMessage } from '../FlashMessage';
import { getErrorMessage } from '../../helpers';
import {
  units,
  opaqueBlack54,
  opaqueBlack05,
  chipStyles,
} from '../../styles/js/shared';
import { stringHelper } from '../../customHelpers';

const StyledLanguageSelect = styled.span`
  select {
    background: ${opaqueBlack05};
    color: ${opaqueBlack54};
    border: 1px solid ${opaqueBlack54};
    padding: 1px;
    outline: 0;
    font-size: 14px;
  }
`;

const StyledLanguageIcon = styled.span`
  svg {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-${props => (props.theme.dir === 'rtl' ? 'left' : 'right')}: 0 !important;
    margin-${props => (props.theme.dir === 'rtl' ? 'right' : 'left')}: ${units(1)};
  }
`;

const StyledMediaTagsContainer = styled.div`
  width: 100%;

  .media-tags {
    &:empty {
      display: none;
    }
  }

  .media-tags__tag {
    ${chipStyles}
    svg {
      color: ${opaqueBlack54};
      margin-${props => (props.theme.dir === 'rtl' ? 'left' : 'right')}: ${units(1)};
    }
  }

  .media-tags__language {
    white-space: nowrap;
  }
`;

// TODO Fix a11y issues
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
class MediaTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correctingLanguage: false,
    };
  }

  fail = (transaction) => {
    const fallbackMessage = (
      <FormattedMessage
        id="mediaTags.error"
        defaultMessage="Sorry, an error occurred while updating the tag. Please try again and contact {supportEmail} if the condition persists."
        values={{ supportEmail: stringHelper('SUPPORT_EMAIL') }}
      />
    );
    const errorMessage = getErrorMessage(transaction, fallbackMessage);
    this.props.setFlashMessage(errorMessage);
  };

  searchTagUrl(tagString) {
    const { media } = this.props;
    const tagQuery = {
      tags: [tagString],
    };
    const searchQuery = searchQueryFromUrl();

    // Make a new query combining the current tag with whatever query is already in the URL.
    // This allows to support clicking tags on the search and project pages.
    const query = mergeWith({}, searchQuery, tagQuery, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return xor(objValue, srcValue);
      }
      return undefined;
    });
    if (!query.tags.length) {
      delete query.tags;
    }
    return urlFromSearchQuery(query, `/${media.team.slug}/all-items`);
  }

  handleCorrectLanguageCancel() {
    this.setState({ correctingLanguage: false });
  }

  handleCorrectLanguage() {
    this.setState({ correctingLanguage: true });
  }

  handleLanguageChange(e) {
    this.handleLanguageSubmit(e);
  }

  handleLanguageSubmit(e) {
    const { media } = this.props;
    const onSuccess = () => {
      this.setState({ correctingLanguage: false });
    };
    const onFailure = transaction => this.fail(transaction);

    Relay.Store.commitUpdate(
      new UpdateLanguageMutation({
        id: media.dynamic_annotation_language.id,
        projectMediaId: media.id,
        languageCode: e.target.value,
        languageName: e.target.selectedOptions[0].innerText,
      }),
      { onSuccess, onFailure },
    );
  }

  handleTagViewClick(tagString) {
    const url = this.searchTagUrl(tagString);
    browserHistory.push(url);
  }

  render() {
    const { media } = this.props;
    const tags = this.props.tags || [];

    return (
      <StyledMediaTagsContainer className="media-tags__container">
        <div className="media-tags">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <ul className="media-tags__list">
                {tags.map((tag) => {
                  if (tag.node.tag_text) {
                    return (
                      <li
                        key={tag.node.id}
                        onClick={this.handleTagViewClick.bind(this, tag.node.tag_text)}
                        className="media-tags__tag"
                      >
                        {tag.node.tag_text.replace(/^#/, '')}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              {media.language ?
                <ul className="media-tags__list">
                  <li className="media-tags__tag media-tags__language">
                    {this.state.correctingLanguage ?
                      <span>
                        <FormattedMessage
                          id="mediaTags.language"
                          defaultMessage="Language: {language}"
                          values={{ language: '' }}
                        />
                        {' '}
                        <StyledLanguageSelect>
                          <LanguageSelector
                            onChange={this.handleLanguageChange.bind(this)}
                            team={media.team}
                            selected={media.language_code}
                          />
                        </StyledLanguageSelect>
                        {' '}
                        <StyledLanguageIcon>
                          <CancelIcon
                            onClick={this.handleCorrectLanguageCancel.bind(this)}
                          />
                        </StyledLanguageIcon>
                      </span> :
                      <span>
                        <FormattedMessage
                          id="mediaTags.language"
                          defaultMessage="Language: {language}"
                          values={{ language: media.language }}
                        />
                        <Can permissions={media.permissions} permission="create Dynamic">
                          <StyledLanguageIcon>
                            <EditIcon
                              onClick={this.handleCorrectLanguage.bind(this)}
                            />
                          </StyledLanguageIcon>
                        </Can>
                      </span>
                    }
                  </li>
                </ul>
                : null}
            </div>
          </div>
        </div>
      </StyledMediaTagsContainer>
    );
  }
}

MediaTags.propTypes = {
  setFlashMessage: PropTypes.func.isRequired,
  media: PropTypes.object.isRequired,
  tags: PropTypes.object.isRequired,
};

export default withSetFlashMessage(MediaTags);
