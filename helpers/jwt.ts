import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
interface data{
  id: string
  email: string
}
export const jwtDecode = () => {
  const token = Cookies.get('admin');
  if (token) {
    const data = jwt.decode(token) as data; 
    
    return data;
  } else {
    
    return null;
  }
};
