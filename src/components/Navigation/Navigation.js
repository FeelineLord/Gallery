import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import { SelectAmount, SelectTheme, } from './SelectSettings';

export default class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requiredLength: [],
      likedLinks: [],
      page: 1
    };

    this.currentLikedLength = 1;
    this.currentLength = 10;
  };

  componentDidMount() {
    this.renderLoremIpsumArray();
    this.renderLikedLinks();
    this.setState({
      page: this.props.currentPage
    });
  };

  componentDidUpdate() {
    if (Math.floor(1000 / this.props.data.settings.imagesPerPage) !== this.currentLength) {
      this.renderLoremIpsumArray();
    };
    if (Math.ceil(this.props.data.liked.length / this.props.data.settings.imagesPerPage) !== this.currentLikedLength) {
      this.renderLikedLinks();
    };
    if (this.props.currentPage !== this.state.page) {
      this.setState({
        page: this.props.currentPage
      });
    };
  };

  renderLoremIpsumArray = () => {
    this.currentLength = Math.floor(1000 / this.props.data.settings.imagesPerPage);
    let len = [];
    len.length = this.currentLength;
    len.fill('el');

    this.setState({
      requiredLength: [ ...len ]
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
    const { requiredLength, likedLinks, page } = this.state;
    const { data, setSettings, theme, createTempPages } = this.props;
    const navClassName = 'navigation navigation_' + theme;
    const navListClassName = 'navigation__list navigation__list_' + theme;
    const buttonLeftClassName = 'navigation__slide navigation__slide_left navigation__slide_left_' + theme;
    const buttonRightClassName = 'navigation__slide navigation__slide_right navigation__slide_right_' + theme;
    let sliderRightUrl ;
    let sliderLeftUrl ;
    let requiredArr = data.settings.pageLiked ? [ ...likedLinks ] : [ ...requiredLength ];

    if (data.settings.pageLiked) {
      sliderRightUrl = page === this.currentLikedLength
      ? '/liked/1' 
      : '/liked/' + (page + 1);
      sliderLeftUrl = page === 1 
      ? '/liked/' + this.currentLength
      : '/liked/' + (page - 1);
    } else {
      sliderRightUrl = page === this.currentLength 
      ? '/' 
      : '/images/' + (page + 1);
      sliderLeftUrl = page === 1 
      ? '/images/' + this.currentLength
      : page === 2 
        ? '/'
        : '/images/' + (page - 1);
    };
    return (
      <>
      <nav className={navClassName}>
        <SelectTheme
          className='navigation__selectTheme '
          data={data}
          selectName='theme:'
          setSettings={setSettings}>
        </SelectTheme>
        <Link
          className={buttonLeftClassName}
          to={sliderLeftUrl}>
        </Link>
        <ul className={navListClassName}>
          {requiredArr.map((item, index, arr) => {
            let url ;
            if (data.settings.pageLiked) {
              url = '/liked/' + (index + 1)
            } else {
              url = index === 0 ? '/' : '/images/' + (index + 1);
            };
            let itemClassName ;

            if (arr.length > 5) {
              itemClassName = `${page + 4 > index && page - 1 <= index && page !== index + 1
                ? 'navigation__item navigation__item_visible navigation__item_visible_' + theme
                : 'navigation__item navigation__item_' + theme} ${page === index + 1 
                  ? ' navigation__item_current navigation__item_current_' + theme
                  : ''}`
            } else if (arr.length > 1) {
              itemClassName = `${page + 4 > index && page - 1 <= index && page !== index + 1
                ? 'navigation__item navigation__item_visible navigation__item_visible_' + theme
                : 'navigation__item navigation__item_' + theme} ${page === index + 1 
                  ? ' navigation__item_current navigation__item_current_' + theme
                  : ''}`
            } else {
              itemClassName = 'navigation__item navigation__item_' + theme + ' navigation__item_current navigation__item_current_' + theme;
            }
            
            return (
            <li 
              className={itemClassName}
              value={index + 1}
              key={index}>
              <Link 
                to={url} 
                className='navigation__link'>{index + 1}
              </Link>
            </li>
            )
          })}
        </ul>
        <Link
          className={buttonRightClassName}
          to={sliderRightUrl}>
        </Link>
        <SelectAmount
          className='navigation__selectAmount '
          data={data}
          selectName='images per page:'
          setSettings={setSettings}
          createTempPages={createTempPages}
          theme={theme}
          currentPage={page}>
        </SelectAmount>
      </nav>
      </>
    );
  };
};