import axios from 'axios';

axios.interceptors.request.use(
	function (config) {
		const token = localStorage.getItem('token');
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

// 注册
export const userRegisterRequest = (userData) => {
	return axios.post(
		'https://121.36.26.183:3000/api/users',
		userData
	);
};

// 检查用户名是否存在
export const isUserExist = (username) => {
	return axios.get(
		`https://121.36.26.183:3000/api/users/${username}`,
		username
	);
};

// 登录
export const login = (data) => {
	return axios.post('https://121.36.26.183:3000/api/login', data);
};

// 退出登录
export const logOut = () => {
	//取消请求头中的信息
	delete axios.defaults.headers.common['Authorization'];
	localStorage.clear();
};

// 查询用户信息
export const checkUserInfo = (userId) => {
	return axios.post(
		'https://121.36.26.183:3000/api/userInfo',
		userId
	);
};

// 修改用户头像
export const updateAvatar = (userData) => {
	return axios.post(
		'https://121.36.26.183:3000/api/userAvatar',
		userData
	);
};

// 查询用户笔记
export const getNote = (userId) => {
	return axios.post('https://121.36.26.183:3000/api/note', userId);
};

// 新增笔记
export const newNote = (data) => {
	return axios.post('https://121.36.26.183:3000/api/newnote', data);
};

// 修改笔记
export const updateNote = (data) => {
	return axios.post(
		'https://121.36.26.183:3000/api/updatenote',
		data
	);
};

// 删除笔记
export const deleteNote = (data) => {
	return axios.post(
		'https://121.36.26.183:3000/api/deletenote',
		data
	);
};

// 查询用户待办
export const getTodo = (userId) => {
	return axios.post('https://121.36.26.183:3000/api/todo', userId);
};
// 新增待办
export const newTodo = (data) => {
	return axios.post('https://121.36.26.183:3000/api/newtodo', data);
};

// 修改待办标题
export const updateTodoTitle = (data) => {
	return axios.post(
		'https://121.36.26.183:3000/api/updatetodotitle',
		data
	);
};

// 修改待办内容
export const updateTodoContent = (data) => {
	return axios.post(
		'https://121.36.26.183:3000/api/updatetodoContent',
		data
	);
};

// 删除待办
export const deleteTodo = (data) => {
	return axios.post(
		'https://121.36.26.183:3000/api/deletetodo',
		data
	);
};
