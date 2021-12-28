import {AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LoginIcon from '@mui/icons-material/Login';
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {Page, setPage, toggleShowAuthModal, toggleShowEntryModal} from "../store/reducers/globalReducer";
import {getEntries} from "../actions";

export const MenuContainer = () => {
  const { isAuthenticated } = useAppSelector(state => state.global);
  const dispatch = useAppDispatch();

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            180 Days Challenge 2022
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={() => {
                handleCloseNavMenu();
                dispatch(setPage(Page.INFO));
              }}>
                <Typography textAlign="center">Progress</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                handleCloseNavMenu();
                dispatch(setPage(Page.GRAPH));
              }}>
                <Typography textAlign="center">Graph</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                handleCloseNavMenu();
                getEntries(dispatch);
              }}>
                <Typography textAlign="center">Refresh</Typography>
              </MenuItem>
              {isAuthenticated
                ? (
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      dispatch(toggleShowEntryModal())
                    }}
                  >
                    <Typography textAlign="center">Add entry</Typography>
                  </MenuItem>
                )
                : (
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      dispatch(toggleShowAuthModal())
                    }}
                  >
                    <Typography textAlign="center">Log in</Typography>
                  </MenuItem>
                )
              }
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            180 Days Challenge 2022
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <div
              style={{
                flex: 1,
                flexGrow: 1,
                flexDirection: "row",
                display: "flex"
              }}
            >
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  dispatch(setPage(Page.INFO));
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Progress
              </Button>

              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  dispatch(setPage(Page.GRAPH));
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Graph
              </Button>
            </div>
            <Button
              sx={{ my: 2, color: 'white', display: 'block' }}
              onClick={() => getEntries(dispatch)}
            >
              <RefreshIcon />
            </Button>
            {isAuthenticated
              ? (
                <Button
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  onClick={() => dispatch(toggleShowEntryModal())}
                >
                  <AddBoxIcon />
                </Button>
              )
              : (
                <Button
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  onClick={() => dispatch(toggleShowAuthModal())}
                >
                  <LoginIcon />
                </Button>
              )
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
