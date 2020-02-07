import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export class SelectSize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      adaptive: false
    };

    this.debouncer = null;
  };

  handleHover = (bool) => {
    if (this.state.adaptive) {
      return ;
    };
    if (bool && !this.state.opened) {
      this.setState({
        opened: bool
      })
    } else if (bool) {
      clearTimeout(this.debouncer);
    } else {
      this.debouncer = setTimeout(() => {
        this.setState({
          opened: this.state.adaptive ? true : bool
        }, () => {this.debouncer = null});
      }, 2000);
    };
  };

  handleClick = () => {
    if (this.state.opened || this.state.adaptive) {
      return ;
    } else {
      this.setState({
        opened: true
      });
    };
  };

  componentDidMount() {
    this.adaptive();
    window.addEventListener('resize', this.adaptive);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.adaptive);
  };

  adaptive = () => {
    if (window.innerWidth <= 750 && !this.state.adaptive) {
      this.setState({
        adaptive: true,
        opened: true
      });
    } else if (window.innerWidth > 750 && this.state.adaptive) {
      this.setState({
        adaptive: false,
        opened: false
      });
    } else {
      return ;
    };
  };

  render() {
    const { className, data, selectName, theme } = this.props;
    const { opened } = this.state;
    return (
      <div 
        className={'selectSize ' + className + `${theme === 'fantasy' ? 'selectSize_fantasy' : 'selectSize_light'}`}
        onMouseEnter={() => {this.handleHover(true)}}
        onMouseLeave={() => {this.handleHover(false)}}
        onClick={this.handleClick}>
        {selectName}
        <span 
          className={`selectSize__symbol ${opened ? 'selectSize__symbol_active' : ''}`}
          style={this.state.adaptive ? {'display': 'none'} : null}>
          &#10148;
        </span>
        {
          opened 
            ? <ul 
                className='selectSize__list'>
                {data.settings.imagesSize.map((item, index) => {
                  if (data.settings.imagesSizeCurrent === index) {
                    return (
                      <li 
                        className='selectSize__item selectSize__item_selected'
                        key={index}>
                        {item}
                      </li>
                    )
                  } else {
                    return (
                      <li 
                        className='selectSize__item'
                        onClick={() => {this.props.setSettings(data, 'imgSize', index)}}
                        value={index}
                        key={index}>
                        {item}
                      </li>
                    )
                  };
                })}
              </ul>
            : null
        }
      </div>
    );
  };
};

export class SelectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  };

  handleClick = (event) => {
    if (this.props.data.liked.length === 0 && !this.props.data.settings.pageLiked) {
      event.preventDefault();
      return ;
    } else {
      return ;
    }
  };

  render() {
    const { className, theme, data } = this.props;
    return(
      <Link 
        className={'selectPage ' + className + `${theme === 'fantasy' ? 'selectPage_fantasy' : 'selectPage_light'}`}
        to={data.settings.pageLiked ? '/' : '/liked/1/'}
        onClick={this.handleClick}>
        {data.settings.pageLiked ? 'all images' : 'liked'}
        {data.settings.pageLiked 
        ? <span 
            className='selectPage__symbol selectPage__symbol_current'>
            &#10047;
          </span> 
        : <span 
            className='selectPage__symbol'>
            &#10084;
          </span>}
      </Link>
    );
  };
};