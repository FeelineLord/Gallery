import React, {Component} from 'react';
import './styles/styles.css';
import dataDefault from './data/data';

import UserBar from './components/UserBar/UserBar';
import Main from './components/Main/Main';
import Navigation from './components/Navigation/Navigation';

const body = document.querySelector('body');
if (JSON.parse(localStorage.getItem('data'))) {
  body.className = JSON.parse(localStorage.getItem('data')).settings.theme;
} else {
  body.className = 'fantasy'; 
};

class Gallery extends Component {
  constructor() {
    super();

    this.state = {
      data: JSON.parse(localStorage.getItem('data')) || { ...dataDefault },
      visited: JSON.parse(localStorage.getItem('visited')) || false,
      currentPage: 1
    };
  };

  componentDidMount() {
    if (!this.state.visited) {  
      localStorage.setItem('visited', JSON.stringify(true));
      this.createTempPages(dataDefault);
    }; 
  };

  themeChange = (mainData) => {
    if (mainData.settings.theme === 'fantasy') {
      body.className = 'lightToFantasy';
    } else {
      body.className = 'fantasyToLight';
    };
  };

  setSettings = (currentData, property, value) => {
    let dataWillChange = { ...currentData };

    switch(property) {
      case 'imgSize': 
      dataWillChange.settings.imagesSizeCurrent = value;
      break;

      case 'imgAmount': 
      dataWillChange.settings.imagesPerPage = value;
      break;

      case 'pageChange': 
      dataWillChange.settings.pageLiked = value;
      break;

      case 'themeChange': 
      dataWillChange.settings.theme = value;
      this.themeChange(dataWillChange);
      break;

      default:
      return ;
    };

    this.setState({
      data: { ...dataWillChange }
    }, () => {
      localStorage.setItem('data', JSON.stringify({ ...this.state.data }));
    });
  };

  likedChange = (currentData, obj) => {
    let dataWillChange = { ...currentData };
    let i ;

    if (dataWillChange.liked.find((item, index) => {
      i = index;
      return item.id === obj.id;
    })) {
      dataWillChange.liked.splice(i, 1);
    } else {
      dataWillChange.liked.push(obj);
    };

    this.setState({
      data: { ...dataWillChange }
    }, () => {
      localStorage.setItem('data', JSON.stringify({ ...this.state.data }));
    });
  };

  setCurrentPage = (page) => {
    this.setState({
      currentPage: page
    });
  };

  createTempPages = (currentData) => {
    let dataWillChange = { ...currentData };
    dataWillChange.temp = [];
    dataWillChange.temp.length = Math.floor(1000 / dataWillChange.settings.imagesPerPage);
    dataWillChange.temp.fill(false);

    this.setState({
      data: { ...dataWillChange }
    }, () => {
      localStorage.setItem('data', JSON.stringify({ ...this.state.data }));
    });
  };

  setTempPages = (currentData, page, array) => {
    let dataWillChange = { ...currentData };
    dataWillChange.temp[page] = array;

    this.setState({
      data: { ...dataWillChange }
    }, () => {
      localStorage.setItem('data', JSON.stringify({ ...this.state.data }));
    });
  };

  switchPages = (currentData, bool) => {
    let dataWillChange = { ...currentData };
    dataWillChange.settings.pageLiked = bool;

    this.setState({
      data: { ...dataWillChange }
    });
  };

  render() {
    const { data, currentPage } = this.state;
    return (
      <>
      <UserBar
        data={data}
        setSettings={this.setSettings}
        className={data.settings.theme === 'fantasy' ? 'userBar_fantasy' : 'userBar_light'}
        theme={data.settings.theme}>
      </UserBar>
      <Main
        switchPages={this.switchPages}
        likedChange={this.likedChange}
        data={data}
        theme={data.settings.theme}
        setPage={this.setCurrentPage}
        setTempPages={this.setTempPages}>
      </Main>
      <Navigation
        data={data}
        setSettings={this.setSettings}
        createTempPages={this.createTempPages}
        currentPage={currentPage}
        theme={data.settings.theme}>
      </Navigation>
      </>
    );
  };
};

export default Gallery;
