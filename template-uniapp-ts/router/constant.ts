import $Home from './constants/home';
import $Users from './constants/users';
interface RouterPathInterface {
	Home: typeof $Home;
	Users: typeof $Users;
}

const $RouterPath: RouterPathInterface = {
	Home: $Home,
	Users: $Users
};

export default $RouterPath;
