/**
 * @description api 接口
 */
import axios from 'axios';

const API = axios.create({
  // 和 vite.config 里跨域配置保持一致。
  baseURL: '/api'
});