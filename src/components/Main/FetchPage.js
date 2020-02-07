import React, {Component} from 'react';

export default class FetchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imagesArr: [],
      loaded: false,
      ready: false,
      error: null,
      viewmode: false
    };

    this.coef = 4;
    this.currentClassName = '';
    this.currentItem = null;
    this.debounce = null;
    this.wasStarted = false;
  };

  componentDidMount() {
    this.props.switchPages(this.props.data, false);
    this.props.setPage(this.props.page);
    this.currentSize = this.props.data.settings.imagesSizeCurrent;
    this.currentPageSize = this.props.data.settings.imagesPerPage;

    switch(this.props.data.settings.imagesSizeCurrent) {
      case 0:
      this.coef = window.innerWidth > 1367 ? 7 : window.innerWidth > 800 ? 5 : 3;
      break;

      case 1:
      this.coef = window.innerWidth > 1367 ? 5 : window.innerWidth > 800 ? 4 : 2;
      break;

      case 2:
      this.coef = window.innerWidth > 1367 ? 3 : window.innerWidth > 800 ? 2 : 1;
      break;

      default:
      this.coef = 4;
      break;
    };

    if (this.props.data.temp[this.props.page - 1]) {
      let res = this.spliter(this.props.data.temp[this.props.page - 1], this.coef);
      this.setState({
        imagesArr: res,
        ready: true
      });
    } else {
      this.fetchingImages(this.props.page, this.props.data.settings.imagesPerPage);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.data.settings.imagesSizeCurrent !== this.currentSize) {
      switch(this.props.data.settings.imagesSizeCurrent) {
        case 0:
        this.coef = window.innerWidth > 1367 ? 7 : window.innerWidth > 800 ? 5 : 3;
        break;
  
        case 1:
        this.coef = window.innerWidth > 1367 ? 5 : window.innerWidth > 800 ? 4 : 2;
        break;
  
        case 2:
        this.coef = window.innerWidth > 1367 ? 3 : window.innerWidth > 800 ? 2 : 1;
        break;
  
        default:
        this.coef = 4;
        break;
      };
      this.updateSpliter(this.state.imagesArr, this.coef);
      this.currentSize = this.props.data.settings.imagesSizeCurrent;
    };
    if (this.props.data.settings.imagesPerPage !== this.currentPageSize) {
      this.fetchingImages(this.props.page, this.props.data.settings.imagesPerPage);
      this.currentPageSize = this.props.data.settings.imagesPerPage;
    };

    if(prevProps.page !== this.props.page) {
      this.props.setPage(this.props.page);

      if (this.props.data.temp[this.props.page - 1]) {
        let res = this.spliter(this.props.data.temp[this.props.page - 1], this.coef);
        this.setState({
          imagesArr: res,
          ready: true
        });
      } else {
        this.fetchingImages(this.props.page, this.props.data.settings.imagesPerPage);
      };
    };
  };

  fetchingImages = (page, limit) => {
    fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          loaded: true,
        }, () => {
          this.arrayMix([...result])
        })}, (error) => {
        this.setState({
        loaded: true,
        error
      });
    });
  };

  arrayMix = (array) => {
    let j ;
    let temp ;
    const mixedArr = [ ...array ];

    for (let i = mixedArr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random()*(i + 1));

      temp = mixedArr[j];
      mixedArr[j] = mixedArr[i];
      mixedArr[i] = temp;
    };

    if (!this.props.data.temp[this.props.page - 1]) {
      this.props.setTempPages(this.props.data, this.props.page - 1, mixedArr);
    };

    let res = this.spliter(mixedArr, this.coef);

    this.setState({
      imagesArr: res,
      ready: true
    });
  };

  spliter = (arr, n) => {
    let oldArr = this.resizer(arr);
    let count = Math.floor(oldArr.length / n);
    let newArr = [];
    for (let i = 0; i < n; i++) {
      newArr = [ ...newArr, oldArr.splice(0, count) ];
    };
    if (newArr.flat(1).length !== arr.length) {
      let diff = arr.length - newArr.flat(1).length;
      let elements = [ ...oldArr ];
      let counter = 0;
      for (let i = n; i > n - diff; i--) {
        newArr[i - 1].push(elements[counter]);
        counter ++;
      };
    };
    return newArr;
  };

  resizer = (arr) => {
    let arrayWillChange = [ ...arr ];
    let requiredWidth = window.innerWidth > 1367 
      ? Math.floor(window.innerWidth / 3)
      : window.innerWidth > 800
        ? Math.floor(window.innerWidth / 2)
        : window.innerWidth;

    return arrayWillChange.map((item) => {
      let width = item.width;
      let height = item.height;
      let ratio = width / height;
      width = requiredWidth;
      height = Math.floor(width / ratio);
      let link = item.download_url.replace(/id.{1,}[0-9]/g, '') + `id/${item.id}/${width}/${height}`;
      let requiredObj = { ...item };
      requiredObj.download_url = link;
      return requiredObj;
    });
  };

  updateSpliter = (arr, n) => {
    let oldArr = [ ...arr.flat(1) ];
    let count = Math.floor(oldArr.length / n);
    let newArr = [];
    for (let i = 0; i < n; i++) {
      newArr = [ ...newArr, oldArr.splice(0, count) ]
    };
    if (newArr.flat(1).length !== arr.flat(1).length) {
      let diff = arr.flat(1).length - newArr.flat(1).length;
      let elements = [ ...oldArr ];
      let counter = 0;
      for (let i = n; i > n - diff; i--) {
        newArr[i - 1].push(elements[counter]);
        counter ++;
      };
    };
    this.setState({
      imagesArr: [ ...newArr ]
    });
  };

  enableViewMode = (e, el) => {
    if (e.target.classList.contains('imageView__width') || e.target.classList.contains('imageView__height')) {
      return ;
    };

    document.querySelector('.fetchPage').style.zIndex = 400;

    let item = e.target;

    let imageNewWidth ;
    let imageNewHeight ;
    let imageRatio = +item.width / +item.height;

    imageNewWidth = window.innerWidth;
    imageNewHeight = Math.floor(window.innerWidth / imageRatio);

    let url = `https://picsum.photos/id/${el.id}/${imageNewWidth}/${imageNewHeight}`;
    this.currentItem = item;
    this.setState({
      viewmode: true
    }, () => {
      this.showImage(item, url)
    }); 
  };

  disableViewMode = () => {
    document.querySelector('.fetchPage').style.zIndex = 6;
    this.setState({
      viewmode: false
    }, () => {
      window.removeEventListener('resize', this.viewModeResize);
      this.currentItem.className = this.currentClassName;
      this.currentItem.style.left = '';
      this.currentItem.style.top = '';
      this.wasStarted = false;
      this.currentItem.id = 'viewModeWasDisabled';
    });
  };

  showImage = (el, src) => {
    this.currentClassName = el.className;
    el.className = "imageView imageView__height";
    el.id = 'imageView';
    this.viewModeResize();
    el.style.left = `${((window.innerWidth - 12) - el.offsetWidth) / 2}px`;
    el.style.top = `${(window.innerHeight - el.offsetHeight) / 2}px`;
    el.src=`${src}`;
    window.addEventListener('resize', this.viewModeResize);
  };

  viewModeResize = () => {
    clearTimeout(this.debounce);
    let img = document.querySelector('#imageView');
    let realHeight = +img.src.replace(/(https.+?\d\/)(\d.+\/)/g, '');
    let realWidth = +img.src.replace(/(https.+?\d\/)/g, '').replace(/\/.+\d/g, '');
    let imgRatio = realWidth / realHeight;
    let userRatio = (window.innerWidth - 12) / window.innerHeight;
    let url = img.src.match(/(https.+?\d\/)/g, '').join('') + window.innerWidth + '/' + Math.floor(window.innerWidth / imgRatio);

    if (this.wasStarted) {
      this.debounce = setTimeout(() => {
        img.src = url;
      }, 500);
    };
    
    if (userRatio <= imgRatio) {
      img.className="imageView imageView__width";
      img.style.left = `${((window.innerWidth - 12) - img.offsetWidth) / 2}px`;
      img.style.top = `${(window.innerHeight - img.offsetHeight) / 2}px`;
    } else {
      img.className="imageView imageView__height";
      img.style.left = `${((window.innerWidth - 12) - img.offsetWidth) / 2}px`;
      img.style.top = `${(window.innerHeight - img.offsetHeight) / 2}px`;
    }

    this.wasStarted = true;
  };

  render() {
    const { imagesArr, viewmode, } = this.state;
    const { data, likedChange, theme } = this.props;
    const columnsClassName = 'fetchPage__column fetchPage__column_' + this.coef;
    const wrappersClassName = 'fetchPage__imageWrapper fetchPage__imageWrapper_' + this.coef + ' fetchPage__imageWrapper_' + theme;
    const sectionClassName = 'main__fetchPage fetchPage fetchPage_' + this.coef + ' fetchPage_' + theme;
    const imagesClassName = 'fetchPage__image fetchPage__image_' + this.coef;
    const hearthClassName = 'fetchPage__hearth fetchPage__hearth_' + this.coef;
    const authorClassName = 'fetchPage__author fetchPage__author_' + this.coef + ' fetchPage__author_' + theme;
    const hearthStyle = {'color': 'red'};
    return (
      <section 
        className={sectionClassName}
        id='pageSection'>
        {imagesArr.map((arr, i) => (
          <div
            key={i} 
            className={columnsClassName}
            id='pageColumn'>
            {arr.map((item, index) => (
              <div 
                className={wrappersClassName}
                key={index}
                id='pageImgWrapper'>
                <img
                  src={item.download_url}
                  alt='item'
                  className={imagesClassName}
                  onClick={e => this.enableViewMode(e, item)}
                  id='pageImg'/>
                <span
                  className={hearthClassName}
                  style={data.liked.find((like) => {return item.id === like.id}) ? hearthStyle : {}}
                  onClick={() => likedChange(data, item)}
                  id='pageHearth'>
                  &#10084;
                </span>
                <span
                  className={authorClassName}
                  id='pageAuthor'>
                  {item.author.length > 23 ? 'Jedi Master' : item.author}
                </span>
              </div>
            ))}
          </div>
        ))}
        <div 
          className={`fetchPage__viewmode ${viewmode ? 'fetchPage__viewmode_enabled' : ''}`}>
          <button 
            onClick={this.disableViewMode}
            className='fetchPage__closeView'>
          </button>
        </div>
      </section> 
    );
  };
};