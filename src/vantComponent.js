import Vue from 'vue';
import {
  NavBar,
  Button,
  RadioGroup,
  Radio,
  CellGroup,
  Cell,
  Icon,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Checkbox,
  CheckboxGroup,
  Field,
  Picker,
  Tab,
  Tabs,
  Switch,
  DatetimePicker,
  Swipe,
  SwipeItem,
  Panel,
  List,
  Search,
  Dialog,
  ActionSheet,
  Slider,
  Uploader,
} from 'vant';

window.Toast = Toast;

Vue.use(NavBar)
  .use(Button)
  .use(RadioGroup)
  .use(Radio)
  .use(CellGroup)
  .use(Cell)
  .use(Icon)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Field)
  .use(Picker)
  .use(Tab)
  .use(Tabs)
  .use(Switch)
  .use(DatetimePicker)
  .use(Swipe)
  .use(SwipeItem);
// Vue.use(Panel);
// Vue.use(List);
// Vue.use(Search);

// Vue.use(Dialog);
// Vue.use(ActionSheet);
// Vue.use(Slider);
// Vue.use(Uploader);
