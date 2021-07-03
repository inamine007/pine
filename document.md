# PINE
## PWAチャットアプリ

### 機能
- ログイン・ログアウト
- 友達追加
- 友達検索
- ブロック
- チャット
  - 1対1チャット
  - グループチャット
  - 既読、未読
  - ファイルアップロード(画像、動画、PDF)
  - 通知
- ビデオチャット(1対1)
- 音声通話

### 画面
- 新規登録
- ログイン
- ホーム
  - 友達一覧
  - グループ一覧
  - 検索フォーム
- トーク一覧
- トーク(ルーム)
- ユーザー画面
  - トークボタン、ビデオ通話ボタン,音声通話ボタン
- プロフィール
  - 設定フォーム

### DB
- users
  - name varchar(25)
  - email varchar(255)
  - password varchar(255)
  - icon varchar(255)
  - background varchar(255)
- relationship
  - from_user_id int
  - to_user_id int
  - friend_flg char(1)
  - block_flg char(1)
- directRooms
  - name varchar(25)
- groupRooms
  - name varchar(25)
  - userCount int
- messages
  - user_id int
  - room_id int
  - message text
  - file varchar(255)
- entries
  - user_id int
  - d_room_id int
  - g_room_id int
  - enteredat timestamp
  - latest_message_id int

### 工数
- UIデザイン: 6 => 3.5 6/27
- API実装: 50
  - 認証: 6 => 6 6/29
  - 友達追加: 4 => 8.5 7/2
  - チャット: 20
  - ビデオチャット: 10
  - 音声通話: 4
  - ブロック: 2 => 2 7/3
  - 検索: 4
- フロント実装: 44
  - 新規登録: 6
  - ログイン: 2 
  - ホーム: 10
  - トーク一覧: 6
  - トーク: 8
  - ユーザー画面: 6
  - プロフィール画面: 6
