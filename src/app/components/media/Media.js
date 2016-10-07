import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import MediaRoute from '../../relay/MediaRoute';
import MediaComponent from './MediaComponent';

const MediaContainer = Relay.createContainer(MediaComponent, {
  initialVariables: {
    contextId: null
  },
  fragments: {
    media: () => Relay.QL`
      fragment on Media {
        id,
        dbid,
        published,
        url,
        jsondata,
        last_status,
        annotations_count,
        domain,
        permissions,
        user {
          name,
          source {
            dbid
          }
        }
        tags(first: 10000, context_id: $contextId) {
          edges {
            node {
              tag,
              id
            }
          }
        }
        annotations(first: 10000, context_id: $contextId) {
          edges {
            node {
              id,
              dbid,
              content,
              annotation_type,
              created_at,
              annotator {
                name,
                profile_image
              }
            }
          }
        }
        account {
          source {
            dbid,
            name
          }
        }
      }
    `
  }
});

class Media extends Component {
  render() {
    var route = new MediaRoute({ mediaId: this.props.params.mediaId });
    return (<Relay.RootContainer Component={MediaContainer} route={route} />);
  }
}

export default Media;
