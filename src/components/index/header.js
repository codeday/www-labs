import Box, { Grid, Content } from '@codeday/topo/Box';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Image, { Slideshow } from '@codeday/topo/Image';
import Button from '@codeday/topo/Button';

export default () => (
  <Slideshow
    height="600px"
    marginTop="-150px"
    marginBottom={16}
    duration={15}
    srcs={[
      'https://img.codeday.org/w=1920;h=600;fit=crop;crop=faces,edges/v/y/vyby6cz2rqr5b5x99dptzzrgbdqh9iem49qhkc71uf1vzvbgq9oskiiuym5ryxwycx.jpg',
      'https://img.codeday.org/w=1920;h=600;fit=crop;crop=faces,edges/e/g/eg5pd1gpsrrf8496pbz7s2eqetthaomcdg74tmumzcyy3nwtb92i144axcpi149kjh.jpg',
    ]}
  >
    <Content marginTop="150px">
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }}>
        <Box textAlign={{ base: "center", md: "left" }}>
          <Heading paddingBottom={8} fontFamily="accent" size="2xl" color="white" textShadow="0 0 5px rgba(0,0,0,0.7)">
            CodeLabs is the 100% online tech internship for everyone.
          </Heading>
          <Button
            as="a"
            href="/apply"
            variantColor="green"
            size="lg"
            boxShadow="md"
          >
            Apply Now
          </Button>
          <Button
            as="a"
            href="/mentor"
            variantColor="gray"
            color="green.600"
            size="lg"
            boxShadow="md"
            marginLeft={2}
          >
            Be a Mentor
          </Button>
          <Text marginTop={8} fontWeight="700" color="white" textShadow="0 0 5px rgba(0,0,0,0.8)">Deadline: June 24</Text>
        </Box>
      </Grid>
    </Content>
  </Slideshow>
)
