import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import ModalDialogInYouTube from './ModalDialogInYouTube';

export default {
  title: 'Example/ModalDialogInYouTube',
  component: ModalDialogInYouTube,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story = (args) => <ModalDialogInYouTube {...args} />;

export const Dialog = Template.bind({});
// Primary.args = {
//   primary: true,
//   label: 'Button',
// };
