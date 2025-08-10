'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Button,
  Toolbar,
  Window,
  WindowContent,
  WindowHeader,
  MenuList,
  MenuListItem,
  Separator,
} from 'react95';
import styled from 'styled-components';

// Minesweeperゲームのタイプ定義
interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

type GameStatus = 'waiting' | 'playing' | 'won' | 'lost';

// Minesweeperゲームコンポーネント
const MinesweeperGame: React.FC = () => {
  const BOARD_SIZE = 15;
  const MINE_COUNT = 40;

  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');
  const [flagCount, setFlagCount] = useState(MINE_COUNT);
  const [time, setTime] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  // タイマー機能
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStatus === 'playing') {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus]);

  // 空のボードを初期化
  const initializeBoard = (): Cell[][] => {
    return Array(BOARD_SIZE).fill(null).map(() =>
      Array(BOARD_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
  };

  // 爆弾をランダムに配置
  const placeMines = (board: Cell[][], firstClickRow: number, firstClickCol: number): Cell[][] => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;

    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);

      // 最初のクリック位置とその周辺には爆弾を置かない
      const isFirstClickArea = Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1;

      if (!newBoard[row][col].isMine && !isFirstClickArea) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    return newBoard;
  };

  // 隣接する爆弾の数を計算
  const calculateNeighborMines = (board: Cell[][]): Cell[][] => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                if (newBoard[newRow][newCol].isMine) {
                  count++;
                }
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    return newBoard;
  };

  // セルを再帰的に開く
  const revealCells = (board: Cell[][], row: number, col: number): Cell[][] => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return newBoard;
    if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return newBoard;

    newBoard[row][col].isRevealed = true;

    // 隣接する爆弾がない場合、周囲のセルも開く
    if (newBoard[row][col].neighborMines === 0 && !newBoard[row][col].isMine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
            const recursiveBoard = revealCells(newBoard, newRow, newCol);
            for (let r = 0; r < BOARD_SIZE; r++) {
              for (let c = 0; c < BOARD_SIZE; c++) {
                newBoard[r][c] = recursiveBoard[r][c];
              }
            }
          }
        }
      }
    }

    return newBoard;
  };

  // 勝利条件をチェック
  const checkWin = (board: Cell[][]): boolean => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = board[row][col];
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  // セルをクリック（左クリック）
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;
    if (board[row][col].isRevealed || board[row][col].isFlagged) return;

    let newBoard = [...board];

    // 最初のクリック
    if (isFirstClick) {
      newBoard = initializeBoard();
      newBoard = placeMines(newBoard, row, col);
      newBoard = calculateNeighborMines(newBoard);
      setIsFirstClick(false);
      setGameStatus('playing');
    }

    newBoard = revealCells(newBoard, row, col);

    // 爆弾をクリックした場合
    if (newBoard[row][col].isMine) {
      setGameStatus('lost');
      // すべての爆弾を表示
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true;
          }
        }
      }
    } else if (checkWin(newBoard)) {
      setGameStatus('won');
    }

    setBoard(newBoard);
  };

  // セルを右クリック（フラグ）
  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost') return;
    if (board[row][col].isRevealed) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;

    setBoard(newBoard);
    setFlagCount(prev => newBoard[row][col].isFlagged ? prev - 1 : prev + 1);
  };

  // ゲームリセット
  const resetGame = () => {
    setBoard(initializeBoard());
    setGameStatus('waiting');
    setFlagCount(MINE_COUNT);
    setTime(0);
    setIsFirstClick(true);
  };

  // 初回ボード設定
  useEffect(() => {
    setBoard(initializeBoard());
  }, []);

  // スマイルアイコンの表示
  const getSmileIcon = () => {
    switch (gameStatus) {
      case 'won': return '😎';
      case 'lost': return '☹';
      default: return '☺';
    }
  };

  // セルの表示内容
  const getCellContent = (cell: Cell, row: number, col: number) => {
    if (!cell.isRevealed) return '';
    if (cell.neighborMines === 0) return '';
    return cell.neighborMines.toString();
  };

  // セルの背景色とスタイル
  const getCellStyle = (cell: Cell, row: number, col: number) => {
    const baseStyle = {
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: '900',
      cursor: 'pointer',
      userSelect: 'none' as const,
      fontFamily: 'MS Sans Serif, sans-serif'
    };

    if (!cell.isRevealed) {
      return {
        ...baseStyle,
        backgroundColor: '#c0c0c0',
        borderTop: '2px solid #ffffff',
        borderLeft: '2px solid #ffffff', 
        borderRight: '2px solid #808080',
        borderBottom: '2px solid #808080',
        boxSizing: 'border-box' as const
      };
    }

    // Windows 95の正確な数字色
    const textColor = cell.neighborMines === 1 ? '#0000ff' :  // 青
                     cell.neighborMines === 2 ? '#008000' :  // 緑
                     cell.neighborMines === 3 ? '#ff0000' :  // 赤
                     cell.neighborMines === 4 ? '#000080' :  // 濃い青
                     cell.neighborMines === 5 ? '#800000' :  // 茶色
                     cell.neighborMines === 6 ? '#008080' :  // ティール
                     cell.neighborMines === 7 ? '#000000' :  // 黒
                     cell.neighborMines === 8 ? '#808080' : '#000000'; // 灰色

    return {
      ...baseStyle,
      backgroundColor: cell.isMine ? '#ff0000' : '#c0c0c0',
      borderTop: '1px solid #808080',
      borderLeft: '1px solid #808080',
      borderRight: '1px solid #ffffff', 
      borderBottom: '1px solid #ffffff',
      boxSizing: 'border-box' as const,
      color: cell.isMine ? '#000000' : textColor
    };
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '4px',
      maxHeight: '100%',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* ゲームヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: `${BOARD_SIZE * 30 + 8}px`,
        padding: '8px',
        backgroundColor: '#c0c0c0',
        borderTop: '2px solid #ffffff',
        borderLeft: '2px solid #ffffff',
        borderRight: '2px solid #808080',
        borderBottom: '2px solid #808080',
        boxSizing: 'border-box'
      }}>
        {/* 残り爆弾数 */}
        <div style={{
          backgroundColor: '#000000',
          color: '#ff0000',
          padding: '4px 6px',
          fontFamily: 'monospace, "MS Sans Serif"',
          fontSize: '20px',
          fontWeight: 'bold',
          borderTop: '1px solid #808080',
          borderLeft: '1px solid #808080',
          borderRight: '1px solid #ffffff',
          borderBottom: '1px solid #ffffff',
          minWidth: '48px',
          textAlign: 'center',
          letterSpacing: '2px'
        }}>
          {flagCount.toString().padStart(3, '0')}
        </div>

        {/* スマイルボタン */}
        <button
          onClick={resetGame}
          style={{
            width: '50px',
            height: '50px',
            fontSize: '24px',
            borderTop: '2px solid #ffffff',
            borderLeft: '2px solid #ffffff',
            borderRight: '2px solid #808080',
            borderBottom: '2px solid #808080',
            backgroundColor: '#c0c0c0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onMouseDown={(e) => {
            const button = e.currentTarget;
            button.style.borderTop = '2px solid #808080';
            button.style.borderLeft = '2px solid #808080';
            button.style.borderRight = '2px solid #ffffff';
            button.style.borderBottom = '2px solid #ffffff';
          }}
          onMouseUp={(e) => {
            const button = e.currentTarget;
            button.style.borderTop = '2px solid #ffffff';
            button.style.borderLeft = '2px solid #ffffff';
            button.style.borderRight = '2px solid #808080';
            button.style.borderBottom = '2px solid #808080';
          }}
          onMouseLeave={(e) => {
            const button = e.currentTarget;
            button.style.borderTop = '2px solid #ffffff';
            button.style.borderLeft = '2px solid #ffffff';
            button.style.borderRight = '2px solid #808080';
            button.style.borderBottom = '2px solid #808080';
          }}
        >
          {gameStatus === 'waiting' || gameStatus === 'playing' ? (
            <img 
              src="/images/bol-smile.png" 
              alt="Smile" 
              style={{ 
                width: '32px', 
                height: '32px', 
                objectFit: 'contain',
                userSelect: 'none',
                pointerEvents: 'none'
              }} 
            />
          ) : gameStatus === 'lost' ? (
            <img 
              src="/images/bol-ded.png" 
              alt="Dead" 
              style={{ 
                width: '32px', 
                height: '32px', 
                objectFit: 'contain',
                userSelect: 'none',
                pointerEvents: 'none'
              }} 
            />
          ) : (
            getSmileIcon()
          )}
        </button>

        {/* 経過時間 */}
        <div style={{
          backgroundColor: '#000000',
          color: '#ff0000',
          padding: '4px 6px',
          fontFamily: 'monospace, "MS Sans Serif"',
          fontSize: '20px',
          fontWeight: 'bold',
          borderTop: '1px solid #808080',
          borderLeft: '1px solid #808080',
          borderRight: '1px solid #ffffff',
          borderBottom: '1px solid #ffffff',
          minWidth: '48px',
          textAlign: 'center',
          letterSpacing: '2px'
        }}>
          {Math.min(time, 999).toString().padStart(3, '0')}
        </div>
      </div>

      {/* ゲームボード */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 30px)`,
        gridTemplateRows: `repeat(${BOARD_SIZE}, 30px)`,
        gap: '0',
        borderTop: '3px solid #808080',
        borderLeft: '3px solid #808080',
        borderRight: '3px solid #ffffff',
        borderBottom: '3px solid #ffffff',
        padding: '4px',
        backgroundColor: '#c0c0c0',
        boxSizing: 'content-box'
      }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={getCellStyle(cell, rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
              onMouseDown={(e) => {
                if (!cell.isRevealed && e.button === 0) {
                  const element = e.currentTarget;
                  element.style.borderTop = '1px solid #808080';
                  element.style.borderLeft = '1px solid #808080';
                  element.style.borderRight = '1px solid #ffffff';
                  element.style.borderBottom = '1px solid #ffffff';
                }
              }}
              onMouseUp={(e) => {
                if (!cell.isRevealed && e.button === 0) {
                  const element = e.currentTarget;
                  element.style.borderTop = '2px solid #ffffff';
                  element.style.borderLeft = '2px solid #ffffff';
                  element.style.borderRight = '2px solid #808080';
                  element.style.borderBottom = '2px solid #808080';
                }
              }}
              onMouseLeave={(e) => {
                if (!cell.isRevealed) {
                  const element = e.currentTarget;
                  element.style.borderTop = '2px solid #ffffff';
                  element.style.borderLeft = '2px solid #ffffff';
                  element.style.borderRight = '2px solid #808080';
                  element.style.borderBottom = '2px solid #808080';
                }
              }}
            >
              {cell.isFlagged ? (
                <img 
                  src="/images/bol-flag.png" 
                  alt="Flag" 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    objectFit: 'contain',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }} 
                />
              ) : cell.isRevealed && cell.isMine ? (
                <img 
                  src="/images/bol-bomb.png" 
                  alt="Bomb" 
                  style={{ 
                    width: '22px', 
                    height: '22px', 
                    objectFit: 'contain',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }} 
                />
              ) : (
                getCellContent(cell, rowIndex, colIndex)
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const WindowWrapper = styled.div<{ $isMobile: boolean }>`
  .window-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: '';
      position: absolute;
      background: black;
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .window {
    width: ${props => props.$isMobile ? '95vw' : '485px'};
    height: ${props => props.$isMobile ? '80vh' : '625px'};
    max-width: 100vw;
    max-height: 100vh;
    min-width: ${props => props.$isMobile ? '320px' : '485px'};
    min-height: ${props => props.$isMobile ? '400px' : '625px'};
    box-sizing: border-box;
    border: 2px solid #c0c0c0;
    
    /* 右下の拡大縮小アイコン（リサイズハンドル）を非表示にする */
    &::after {
      display: none !important;
    }
    
    /* より具体的にリサイズハンドルを非表示にする */
    .resize-handle,
    [class*="resize"],
    [class*="ResizeHandle"] {
      display: none !important;
    }
  }
`;

export default function MineAbol() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState<boolean>(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    setIsMobile(checkMobile());
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFileMenuOpen) {
        setIsFileMenuOpen(false);
      }
      if (isEditMenuOpen) {
        setIsEditMenuOpen(false);
      }
    };

    if (isFileMenuOpen || isEditMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isFileMenuOpen, isEditMenuOpen]);

  const handleMenuItemClick = (action: string) => {
    console.log(`Menu action: ${action}`);
    setIsFileMenuOpen(false);
    
    if (action === 'new') {
      // 新規作成機能（後で実装）
      console.log('新規作成');
    } else if (action === 'open') {
      // ファイルを開く機能（後で実装）
      console.log('ファイルを開く');
    } else if (action === 'exit') {
      // Exit - トップページに移動
      router.push('/');
    }
  };

  const handleEditMenuItemClick = (action: string) => {
    console.log(`Edit menu action: ${action}`);
    setIsEditMenuOpen(false);
    
    if (action === 'mine') {
      // マイニング機能（後で実装）
      console.log('マイニング開始');
    } else if (action === 'settings') {
      // 設定機能（後で実装）
      console.log('設定');
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col bg-[#53bba5]`}
      style={{
        overflow: 'hidden',
        touchAction: 'auto',
        userSelect: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      <Header />

      <main 
        className={`flex-1 flex items-center justify-center`}
        style={{
          overflow: 'hidden',
          touchAction: 'auto',
          padding: '4px'
        }}
      >
        <WindowWrapper $isMobile={isMobile}>
          <Window className='window'>
            <WindowHeader className='window-title'>
              <span>mineabol.exe</span>
              <Button>
                <span className='close-icon' />
              </Button>
            </WindowHeader>
            
            <Toolbar style={{ touchAction: 'auto', userSelect: 'auto', pointerEvents: 'auto' }}>
              <div style={{ position: 'relative', touchAction: 'auto', pointerEvents: 'auto' }}>
                <Button 
                  variant='menu' 
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFileMenuOpen(!isFileMenuOpen);
                  }}
                  active={isFileMenuOpen}
                  style={{
                    touchAction: 'auto',
                    pointerEvents: 'auto',
                    userSelect: 'auto',
                    cursor: 'pointer'
                  }}
                >
                  File
                </Button>
                {isFileMenuOpen && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      left: 0, 
                      zIndex: 1000,
                      background: 'white',
                      border: '1px solid #ccc',
                      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                      touchAction: 'auto',
                      pointerEvents: 'auto',
                      userSelect: 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MenuList>
                      <MenuListItem 
                        primary 
                        size='sm'
                        onClick={() => handleMenuItemClick('new')}
                      >
                        New
                      </MenuListItem>
                      <MenuListItem 
                        size='sm'
                        onClick={() => handleMenuItemClick('open')}
                      >
                        Open
                      </MenuListItem>
                      <Separator />
                      <MenuListItem 
                        size='sm'
                        onClick={() => handleMenuItemClick('exit')}
                      >
                        Exit
                      </MenuListItem>
                    </MenuList>
                  </div>
                )}
              </div>
              
              <div style={{ position: 'relative', touchAction: 'auto', pointerEvents: 'auto' }}>
                <Button 
                  variant='menu' 
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditMenuOpen(!isEditMenuOpen);
                  }}
                  active={isEditMenuOpen}
                  style={{
                    touchAction: 'auto',
                    pointerEvents: 'auto',
                    userSelect: 'auto',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </Button>
                {isEditMenuOpen && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      left: 0, 
                      zIndex: 1000,
                      background: 'white',
                      border: '1px solid #ccc',
                      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
                      touchAction: 'auto',
                      pointerEvents: 'auto',
                      userSelect: 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MenuList>
                      <MenuListItem 
                        primary 
                        size='sm'
                        onClick={() => handleEditMenuItemClick('mine')}
                      >
                        Start Mining
                      </MenuListItem>
                      <MenuListItem 
                        size='sm'
                        onClick={() => handleEditMenuItemClick('settings')}
                      >
                        Settings
                      </MenuListItem>
                    </MenuList>
                  </div>
                )}
              </div>
              
              <Button 
                variant='menu' 
                size='sm' 
                disabled
                style={{
                  touchAction: 'auto',
                  pointerEvents: 'auto',
                  userSelect: 'auto'
                }}
              >
                Mine
              </Button>
              
              <Button 
                variant='menu' 
                size='sm' 
                disabled
                style={{
                  touchAction: 'auto',
                  pointerEvents: 'auto',
                  userSelect: 'auto'
                }}
              >
                Stats
              </Button>
            </Toolbar>
            
            <WindowContent style={{ 
              padding: '4px',
              height: 'calc(100% - 64px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box'
            }}>
              <MinesweeperGame />
            </WindowContent>
          </Window>
        </WindowWrapper>
      </main>

      <Footer />
    </div>
  );
}
