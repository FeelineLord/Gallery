import React, {Component} from 'react';

export default class LikedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imagesArr: [],
      ready: false,
      viewmode: false
    };

    this.coef = 4;
    this.currentClassName = '';
    this.currentItem = null;
    this.debounce = null;
    this.wasStarted = false;
    this.pagesAmount = Math.ceil(this.props.data.liked / this.props.data.settings.imagesSizeCurrent);
  };

  componentDidMount() {
    this.props.switchPages(this.props.data, true);
    this.props.setPage(this.props.page);
    this.currentSize = this.props.data.settings.imagesSizeCurrent;
    this.currentPageSize = this.props.data.settings.imagesPerPage;
    this.pagesAmount = Math.ceil(this.props.data.liked.length / this.currentPageSize);

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

    this.renderImages();
  };

  componentWillUpdate(nextProps) {
    
  };

  componentDidUpdate(prevProps) {
    if(prevProps.page !== this.props.page) {
      this.props.setPage(this.props.page);
      this.renderImages(this.props.page, this.props.data.settings.imagesPerPage);
    };
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
      this.pagesAmount = Math.ceil(this.props.data.liked.length / this.currentPageSize);
    };
    if (this.props.data.settings.imagesPerPage !== this.currentPageSize) {
      this.renderImages();
      this.currentPageSize = this.props.data.settings.imagesPerPage;
    };
  };

  renderImages = () => {
    let firstOption = this.spliter(this.props.data.liked, this.pagesAmount);
    let result = this.spliter(firstOption[this.props.page - 1], this.coef);

    this.setState({
      imagesArr: [ ...result ],
    });
  };

  spliter = (arr, n) => {
    let oldArr = this.resizer(arr);
    let count = Math.floor(oldArr.length / n);
    let newArr = [];
    for (let i = 0; i < n; i++) {
      newArr = [ ...newArr, oldArr.splice(0, count) ]
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
      imagesArr: [ ...newArr ],
    });
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

  enableViewMode = (e, el) => {
    if (e.target.classList.contains('imageView__width') || e.target.classList.contains('imageView__height')) {
      return ;
    };

    let item = e.target;

    let imageNewWidth ;
    let imageNewHeight ;
    let imageRatio = +item.width / +item.height;

    imageNewWidth = window.innerWidth;
    imageNewHeight = Math.floor(window.innerWidth / imageRatio);

    let url = `https://picsum.photos/id/${el.id}/${imageNewWidth}/${imageNewHeight}`;
    this.currentItem = item;
    this.setState({
      viewmode: true,
    }, () => {
      this.showImage(item, url)
    }); 
  };

  disableViewMode = () => {
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
                  alt={item.author}
                  src={item.download_url}
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