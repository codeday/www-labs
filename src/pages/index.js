import { Grid, Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import Page from '../components/Page';
import Header from '../components/index/header';
import Intro from '../components/index/intro';
import Tracks from '../components/index/tracks';
import Calendar from '../components/index/calendar';
import Legitimizer from '../components/index/legitimizer';

export default function Home() {
  return (
    <Page slug="/" darkHeader>
      <Header />
      <Intro />
      <Tracks />
      <Content paddingBottom={10}>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <Image boxShadow="sm" borderRadius="sm" src="https://img.codeday.org/600x300/b/q/bq6ta6ptxijo1hbfqztp83wkz97c5a25u7cm9ug51ipgkea17b6fpy9dhzrmjopzu9.jpg" />
          <Image boxShadow="sm" borderRadius="sm" src="https://img.codeday.org/600x300/b/s/bsi4mxy595o46b8qufi5xa4c3oisfhz5to8x1c3t7yz9j9d4utrwdrov4zhihtdxc5.jpg" />
          <Image boxShadow="sm" borderRadius="sm" src="https://img.codeday.org/600x300/7/m/7mp4vzp3jxr5m9hufqfzwxuqjs256wv626xruspxjdqsy6ftchfa7k73xze1uyu8tz.jpg" />
        </Grid>
      </Content>
      <Calendar />
      <Legitimizer />
    </Page>
  )
}
