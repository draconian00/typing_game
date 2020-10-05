export interface IXHROption {
  method?: 'GET' | 'POST';
  params?: {
    [key: string]: string,
  };
}

export interface IXHRError {
  status: number;
  response: string;
}

export default function xhr(
  url: string,
  option?: IXHROption,
): Promise<any | IXHRError> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
  
    // method check
    let method = 'GET';
    if (option && option.method) {
      method = option.method;
    }

    // parameter check
    let params = '';
    if (option && option.params) {
      params = Object.keys(option.params).map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(option.params[key])}`;
        // return `${key}=${option.params[key]}`;
      }).join('&'); 
    }

    // 통신 성공
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // success > status 2XX
        resolve(JSON.parse(xhr.response));
      } else {
        // failed
        const errorInfo: IXHRError = {
          status: xhr.status,
          response: xhr.response,
        };
        reject(errorInfo);
      }
    };

    // on failed
    xhr.onerror = () => {
      const errorInfo: IXHRError = {
        status: xhr.status,
        response: xhr.response,
      };
      reject(errorInfo);
    };

    // call api
    xhr.open(method, url, true);
  
    // set header
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
    xhr.send(params);
  });
}
