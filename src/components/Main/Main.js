import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';

import FetchPage from './FetchPage';
import LikedPage from './LikedPage';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loremPicsumLinks: [],
      likedLinks: [],
    };

    this.currentLength = 20;
    this.currentLikedLength = 1;
  };

  componentDidMount() {
    this.renderLoremIpsumLinks();
    this.renderLikedLinks();
  };

  componentDidUpdate() {
    if (Math.floor(1000 / this.props.data.settings.imagesPerPage) !== this.currentLength) {
      this.renderLoremIpsumLinks();
    };
    if (Math.ceil(this.props.data.liked.length / this.props.data.settings.imagesPerPage) !== this.currentLikedLength) {
      this.renderLikedLinks();
    };
  };

  renderLoremIpsumLinks = () => {
    this.currentLength = Math.floor(1000 / this.props.data.settings.imagesPerPage);
    let len = [];
    len.length = this.currentLength;
    len.fill('el');

    this.setState({
      loremPicsumLinks: [ ...len ],
    });
  };

  renderLikedLinks = () => {
    this.currentLikedLength = Math.ceil(this.props.data.liked.length / this.props.data.settings.imagesPerPage);
    let like = [];
    like.length = this.currentLikedLength;
    like.fill('item');

    this.setState({
      likedLinks: [ ...like ]
    });
  };

  render() {
    const { data, likedChange, theme, setPage, setTempPages, switchPages } = this.props;
    const { loremPicsumLinks, likedLinks } = this.state;
    return (
      <main className='main main_loader'>
          <Route
            paht='/'
            exact render={() => 
              <Switch>
                {loremPicsumLinks.map((link, index) => {
                  const path = index === 0 ? '/' : '/images/' + (index + 1);
                  if (index === 0) {
                    return (
                      <Route 
                        key={'route' + index}
                        path={path}
                        exact render={() => 
                        <FetchPage
                          data={data}
                          likedChange={likedChange}
                          theme={theme}
                          page={index + 1}
                          setPage={setPage}
                          setTempPages={setTempPages}
                          switchPages={switchPages}>
                        </FetchPage>}>
                      </Route>
                    )
                  } else {
                    return (
                      <Route 
                        key={'route' + index}
                        path={path}
                        render={() => 
                        <FetchPage
                          data={data}
                          likedChange={likedChange}
                          theme={theme}
                          page={index + 1}
                          setPage={setPage}
                          setTempPages={setTempPages}
                          switchPages={switchPages}>
                        </FetchPage>}>
                      </Route>
                    )}
                })}
              </Switch>}>
          </Route>
          <Route
            path='/liked/'
            render={() => 
              <Switch>
                {likedLinks.map((link, index) => {
                  const path = `/liked/${index + 1}/`;
                    return (
                      <Route 
                        path={path}
                        key={index}
                        render={() => 
                        <LikedPage
                          data={data}
                          likedChange={likedChange}
                          theme={theme}
                          page={index + 1}
                          setPage={setPage}
                          setTempPages={setTempPages}
                          switchPages={switchPages}>
                        </LikedPage>}>
                      </Route>
                    )}
                  )}
                })}
              </Switch>}>
          </Route>
      </main>
    );
  };
};