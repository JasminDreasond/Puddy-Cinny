/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import './Avatar.scss';

import { twemojify } from '../../../util/twemojify';

import Text from '../text/Text';
import RawIcon from '../system-icons/RawIcon';

import ImageBrokenSVG from '../../../../public/res/svg/image-broken.svg';
import { avatarInitials } from '../../../util/common';

function freezeGif(img, wantedWidth) {

  function createElement(type, callback) {
    const element = document.createElement(type);

    callback(element);

    return element;
  }

  const { width } = img;
  const { height } = img;

  const canvas = createElement('canvas', clone => {
    clone.width = width;
    clone.height = height;
  });
  let attr;
  let i = 0;

  const freeze = () => {

    const ctx = canvas.getContext('2d');

    if (wantedWidth) {
      const aspect = width / height;
      canvas.width = wantedWidth;
      canvas.height = wantedWidth / aspect;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    for (i = 0; i < img.attributes.length; i++) {
      attr = img.attributes[i];

      if (attr.name !== '"') { // test for invalid attributes
        canvas.setAttribute(attr.name, attr.value);
      }
    }

    canvas.classList.add('normal-avatar');
    canvas.classList.remove('anim-avatar');

    img.parentNode.insertBefore(canvas, img);

  };

  if (img.complete) {
    freeze();
  } else {
    img.addEventListener('load', freeze, true);
  }

};

const Avatar = React.forwardRef(({
  text, bgColor, iconSrc, faSrc, iconColor, imageSrc, size, className, imgClass, imageAnimSrc
}, ref) => {
  let textSize = 's1';
  if (size === 'large') textSize = 'h1';
  if (size === 'small') textSize = 'b1';
  if (size === 'extra-small') textSize = 'b3';

  return (
    <div ref={ref} className={`avatar-container avatar-container__${size} ${className} noselect`}>
      {
        // eslint-disable-next-line no-nested-ternary
        imageSrc !== null
          ? (!imageAnimSrc ?

            <img
              className={imgClass}
              draggable="false"
              src={imageSrc}
              onLoad={(e) => { e.target.style.backgroundColor = 'transparent'; }}
              onError={(e) => { e.target.src = ImageBrokenSVG; }}
              alt=""
            />

            :

            <img
              className={`anim-avatar ${imgClass}`}
              draggable="false"
              src={imageAnimSrc}
              onLoad={(e) => { e.target.style.backgroundColor = 'transparent'; /*freezeGif(e.target, 42);*/ }}
              onError={(e) => { e.target.src = ImageBrokenSVG; }}
              alt=""
            />

          )
          : faSrc !== null
            ? (
              <span
                style={{ backgroundColor: faSrc === null ? bgColor : 'transparent' }}
                className={`avatar__border${faSrc !== null ? '--active' : ''}`}
              >
                <RawIcon size={size} fa={faSrc} color={iconColor} />
              </span>
            )

            : (
              <span
                style={{ backgroundColor: iconSrc === null ? bgColor : 'transparent' }}
                className={`avatar__border${iconSrc !== null ? '--active' : ''}`}
              >
                {
                  iconSrc !== null
                    ? <RawIcon size={size} src={iconSrc} color={iconColor} />
                    : text !== null && (
                      <Text variant={textSize} primary>
                        {twemojify(avatarInitials(text))}
                      </Text>
                    )
                }
              </span>
            )
      }
    </div>
  );
});

Avatar.defaultProps = {
  imageAnimSrc: null,
  imgClass: 'img-fluid',
  text: null,
  className: '',
  bgColor: 'transparent',
  iconSrc: null,
  faSrc: null,
  iconColor: null,
  imageSrc: null,
  size: 'normal',
};

Avatar.propTypes = {
  imageAnimSrc: PropTypes.string,
  text: PropTypes.string,
  imgClass: PropTypes.string,
  bgColor: PropTypes.string,
  className: PropTypes.string,
  iconSrc: PropTypes.string,
  faSrc: PropTypes.string,
  iconColor: PropTypes.string,
  imageSrc: PropTypes.string,
  size: PropTypes.oneOf(['large', 'normal', 'small', 'extra-small']),
};

export default Avatar;
