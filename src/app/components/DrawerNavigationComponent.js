import React, { Component } from 'react';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import { FormattedMessage } from 'react-intl';
import IconButton from 'material-ui/IconButton';
import styled from 'styled-components';
import { stringHelper } from '../customHelpers';
import UserMenuItems from './UserMenuItems';
import UserAvatarRelay from '../relay/UserAvatarRelay';
import {
  Text,
  Row,
  Offset,
  HeaderTitle,
  white,
  black05,
  black54,
  units,
  caption,
  avatarSize,
  avatarStyle,
  body2,
} from '../styles/js/shared';

class DrawerNavigation extends Component {

  render() {
    const { inTeamContext, loggedIn, drawerToggle } = this.props;

    // Goal: we want to be able to render this component with:
    //  teamFragment, teamPublicFragment or no fragment.
    //
    // See DrawerNavigation
    //
    // — @chris with @alex 2017-10-2

    // TODO implement these props to make these conditionals work.
    const currentUserIsMember = this.props.currentUserIsMember;
    const teamIsPublic = this.props.teamIsPublic;

    const drawerHeaderHeight = units(14);

    const styles = {
      drawerFooter: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: white,
        padding: `${units(2)}`,
      },
      drawerFooterLink: {
        font: caption,
      },
      drawerProjects: {
        overflow: 'auto',
        marginBottom: 'auto',
      },
      drawerProjectsAndFooter: {
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100vh - ${drawerHeaderHeight})`,
      },
      drawerYourProfileButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: units(4),
        height: units(4),
        padding: 0,
        margin: `0 ${units(1)}`,
      },
    };

    const DrawerHeader = styled.div`
      height: ${drawerHeaderHeight};
      background-color: ${black05};
      padding: ${units(2)};
    `;

    // Team Avatar
    const TeamAvatar = styled.div`
      ${avatarStyle}
      width: ${props => props.size ? props.size : avatarSize};
      height: ${props => props.size ? props.size : avatarSize};
    `;

    const Headline = styled(HeaderTitle)`
      font: ${body2};
      font-weight: 700;
      padding-top: ${units(1)};
      color: ${black54};
    `;

    const SubHeading = styled.div`
      font: ${caption};
      color: ${black54};
      padding: ${units(2)} ${units(2)} ${units(1)} ${units(2)};
    `;

    const TosMenuItem = (
      <a
        style={styles.drawerFooterLink}
        target="_blank"
        rel="noopener noreferrer"
        href={stringHelper('TOS_URL')}
      >
        <FormattedMessage
          id="headerActions.tos"
          defaultMessage="Terms"
        />
      </a>
    );

    const privacyMenuItem = (
      <a
        style={styles.drawerFooterLink}
        target="_blank"
        rel="noopener noreferrer"
        href={stringHelper('PP_URL')}
      >
        <FormattedMessage
          id="headerActions.privacyPolicy"
          defaultMessage="Privacy"
        />
      </a>
    );

    const aboutMenuItem = (
      <a
        style={styles.drawerFooterLink}
        target="_blank"
        rel="noopener noreferrer"
        href={stringHelper('ABOUT_URL')}
      >
        <FormattedMessage
          id="headerActions.about"
          defaultMessage="About"
        />
      </a>
    );

    const contactMenuItem = (
      <a
        style={styles.drawerFooterLink}
        target="_blank"
        rel="noopener noreferrer"
        href={stringHelper('CONTACT_HUMAN_URL')}
      >
        <FormattedMessage
          id="headerActions.contactHuman"
          defaultMessage="Contact"
        />
      </a>
    );

    const yourProfileButton = (
      <Link to="/check/me">
        <IconButton
          style={styles.drawerYourProfileButton}
          tooltip={<FormattedMessage id="drawerNavigation.userProfile" defaultMessage="Your Profile" />}
          tooltipPosition="bottom-center"
        >
          <UserAvatarRelay size={units(4)} {...this.props} />
        </IconButton>
      </Link>
    );

    return (
      <Drawer {...this.props}>
        <div onClick={drawerToggle}>

          {/* TODO review this conditional with @alex */}
          { inTeamContext && (currentUserIsMember || teamIsPublic)
            ? (<DrawerHeader>
              <Row style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <TeamAvatar style={{ backgroundImage: `url(${this.props.team.avatar})` }}size={units(7)} />
                <Offset>
                  { loggedIn && yourProfileButton }
                </Offset>
              </Row>

              <Link
                className="team-header__drawer-team-link"
                to={`/${this.props.team.slug}/`}
              >
                <Headline>{this.props.team.name}</Headline>
              </Link>
            </DrawerHeader>)
            : null
          }

          <Divider />

          <div style={styles.drawerProjectsAndFooter}>

            {/* TODO review this conditional with @alex */}
            { inTeamContext && (currentUserIsMember || teamIsPublic)
              ? (<div>
                <SubHeading>
                  <FormattedMessage
                    id="drawerNavigation.projectsSubheading"
                    defaultMessage="Projects"
                  />
                </SubHeading>
                <div style={styles.drawerProjects}>
                  {this.props.team.projects.edges
                    .sortp((a, b) => a.node.title.localeCompare(b.node.title))
                    .map((p) => {
                      const projectPath = `/${this.props.params.slug}/project/${p.node.dbid}`;
                      return (
                        <Link to={projectPath} key={p.node.dbid} >
                          <MenuItem primaryText={<Text ellipsis>{p.node.title}</Text>} />
                        </Link>
                      );
                    })}
                </div>
              </div>)
              : null }

            { loggedIn
              ? (<div><UserMenuItems hideContactMenuItem {...this.props} /></div>)
              : null }

            <div style={styles.drawerFooter}>
              {TosMenuItem}
              {privacyMenuItem}
              {aboutMenuItem}
              {contactMenuItem}
            </div>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default DrawerNavigation;
