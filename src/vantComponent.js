import Vue from "vue";
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
  Tag,
  Panel,
  List,
  Search,
  Dialog,
  ActionSheet,
  Slider,
  Uploader,
  Loading,
  Overlay,
  Image,
  SwitchCell,
} from "vant";

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
  .use(SwipeItem)
  .use(Overlay)
  .use(Search)
  .use(Dialog)
  .use(Image)
  .use(SwitchCell)
  .use(List)
  .use(Tag)
  .use(Loading);
