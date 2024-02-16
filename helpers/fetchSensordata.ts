import axiosClient from "./axios"
import Cookies from "js-cookie"
export const fetchsensordata = async(type:string,limit:number) =>
{
  const data = await axiosClient.get(`/data/${type}?limit=${limit}`, {
    headers: {
      Authorization : `Bearer ${Cookies.get('user')}`
    }
  })
return data
  
}