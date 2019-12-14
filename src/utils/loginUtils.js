

export const genLoginParams = (deviceCode,token) => {
  const versionType = '2';
  const version = '1.1.0';
  const fromCode = 'android';

  let params = {deviceCode,version,versionType,fromCode};

  if(token){
    params.token = token;
  }

  return params;
};
