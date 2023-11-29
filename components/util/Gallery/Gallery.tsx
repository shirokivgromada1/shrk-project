import { MutableRefObject, useEffect, useRef, useState } from "react";
import styles from "./Gallery.module.scss";
import { Gallery } from "react-grid-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { Image as ImageType } from "react-grid-gallery";
import { lookup } from "mime-types";

type PropFile = {
  name: string;
};

type Props = {
  files: PropFile[] | File[];
};

const GalleryContainer = ({ files }: Props) => {
  const [index, setIndex] = useState(-1);
  const [images, setImages] = useState<ImageType[] | null>(null);

  const handleClick = (index: number, item: ImageType) => setIndex(index);
  const handleClose = () => setIndex(-1);
  const handleMovePrev = () =>
    images && setIndex((index + images.length - 1) % images.length);
  const handleMoveNext = () => images && setIndex((index + 1) % images.length);

  useEffect(() => {
    const imageLoadPromises = [];
    for (let i = 0; i < files.length; i++) {
      const mimeType = lookup(files[i].name);
      if (mimeType) {
        if (mimeType.startsWith("image/")) {
          const loadPromise: Promise<ImageType> = new Promise((resolve) => {
            const img = new Image();
            if (files[i].name.startsWith("http")) {
              fetch(files[i].name)
                .then((res) => res.blob())
                .then((blob) => {
                  img.src = URL.createObjectURL(blob);
                  img.onload = () => {
                    const image: ImageType = {
                      src: img.src,
                      width: img.width,
                      height: img.height,
                      customOverlay: !files[i].name.startsWith("http") && (
                        <div className="custom-overlay__caption">
                          <div>{files[i].name}</div>
                        </div>
                      ),
                    };

                    resolve(image);
                  };
                });
            } else {
              img.src = URL.createObjectURL(files[i] as File);
              img.onload = () => {
                const image: ImageType = {
                  src: img.src,
                  width: img.width,
                  height: img.height,
                  customOverlay: !files[i].name.startsWith("http") && (
                    <div className="custom-overlay__caption">
                      <div>{files[i].name}</div>
                    </div>
                  ),
                };
                resolve(image);
              };
            }
          });
          imageLoadPromises.push(loadPromise);
        }
      }
    }
    if (imageLoadPromises) {
      Promise.all(imageLoadPromises).then((loadedImages) => {
        setImages(loadedImages);
      });
    }
  }, [files]);

  return (
    <>
      {images && images.length > 0 && (
        <div style={{ marginBlock: 16 }}>
          <Gallery
            images={images}
            onClick={handleClick}
            enableImageSelection={false}
          />
          {!!images[index] && (
            <Lightbox
              imageTitle={images[index].caption}
              mainSrc={images[index].src}
              mainSrcThumbnail={images[index].src}
              nextSrc={
                images[(index + 1) % images.length].src || images[index].src
              }
              nextSrcThumbnail={
                images[(index + 1) % images.length].src || images[index].src
              }
              prevSrc={
                images[(index + images.length - 1) % images.length].src ||
                images[index].src
              }
              prevSrcThumbnail={
                images[(index + images.length - 1) % images.length].src ||
                images[index].src
              }
              onCloseRequest={handleClose}
              onMovePrevRequest={handleMovePrev}
              onMoveNextRequest={handleMoveNext}
            />
          )}
        </div>
      )}
    </>
  );
};

export default GalleryContainer;
