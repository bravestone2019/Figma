import { useEffect, useState } from 'react';

function useImageBlobs(files) {
  const [imageBlobUrlsVersion, setImageBlobUrlsVersion] = useState(0);

  useEffect(() => {
    let changed = false;
    let createdBlobUrls = [];
    if (files && files.length > 0) {
      files.forEach(f => {
        if (f.type && f.type.startsWith('image/') && !f._blobUrl) {
          f._blobUrl = URL.createObjectURL(f);
          createdBlobUrls.push(f._blobUrl);
          changed = true;
        }
      });
    }
    if (changed) setImageBlobUrlsVersion(v => v + 1);
    return () => {
      // Clean up created blob URLs
      createdBlobUrls.forEach(url => URL.revokeObjectURL(url));
      if (files && files.length > 0) {
        files.forEach(f => {
          if (f._blobUrl) {
            URL.revokeObjectURL(f._blobUrl);
            delete f._blobUrl;
          }
        });
      }
    };
  }, [files]);

  return imageBlobUrlsVersion;
}

export default useImageBlobs; 