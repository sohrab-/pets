import React from "react";
import { Box, Grid, Heading, Text, Link, NavLink, Image } from "theme-ui";
import GitHubButton from "react-github-btn";

import Main from "../layouts/Main";

const repo = "https://github.com/sohrab-/pets";
const gitHubButtons = [
  { name: "Star", icon: "octicon-star", href: repo },
  { name: "Watch", icon: "octicon-eye", href: `${repo}/subscription` },
  { name: "Fork", icon: "octicon-repo-forked", href: `${repo}/fork` },
  { name: "Issues", icon: "octicon-issue-opened", href: `${repo}/issues` },
];
const contributors = ["halfbakedsneed", "sohrab-", "tsukidust"];

function About() {
  return (
    <Main>
      <Box mb={5}>
        <Heading>About</Heading>
      </Box>
      <Box mb={3}>
        <Text>We're open source!</Text>
      </Box>
      <Box mb={2}>
        <NavLink href={repo}>{repo}</NavLink>
      </Box>
      <Box mb={5}>
        {gitHubButtons.map((button) => (
          <>
            <GitHubButton
              href={button.href}
              data-icon={button.icon}
              data-size="small"
              aria-label={`${button.name} sohrab-/pets on GitHub`}
            >
              {button.name}
            </GitHubButton>{" "}
          </>
        ))}
      </Box>
      <Box mb={3}>
        <Text sx={{ fontWeight: "bold" }}>Created by</Text>
      </Box>
      <Grid columns={[1, 3, 3]} mb={6}>
        {contributors.map((contributor) => (
          <Box>
            <NavLink
              href={`https://github.com/${contributor}`}
              sx={{ fontWeight: "normal" }}
            >
              <Image
                src={`https://github.com/${contributor}.png`}
                sx={{
                  verticalAlign: "middle",
                  borderRadius: "50%",
                  maxWidth: "100px",
                }}
              />
            </NavLink>
          </Box>
        ))}
      </Grid>
      <Box py={2}>
        <Text fontWeight="lighter" fontSize="smaller">
          Icons made by{" "}
          <Link href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </Link>{" "}
          from{" "}
          <Link href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </Link>
        </Text>
      </Box>
    </Main>
  );
}

export default About;
