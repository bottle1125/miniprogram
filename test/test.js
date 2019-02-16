import { mount } from '@vue/test-utils'
import card from '../src/components/card'
import App from '../src/pages/index'
import sinon from 'sinon'

describe('card', () => {
  it('renders a p', () => {
    const spy = sinon.stub()
    const wrapper = mount(App)
    wrapper.setMethods({ clickMethod: spy })

    wrapper.find('button').trigger('click')

    expect(spy.called).toBe(true)
  })
})
