# 여행 추억 남기기 서비스 :  SnapRoad
![로고 큰사이즈](https://github.com/user-attachments/assets/2337e444-4638-4091-a592-322aa727796c)

## 목차
- [SnapRoad 페이지 바로가기](#snaproad-이용하기) 
- [SnapRoad 프로젝트 소개](#프로젝트-소개) 
- [팀원 구성 및 역할](#팀원-구성-및-역할) 
- [개발 기간 및 작업 관리](#개발-기간-및-작업-관리) 
- [SnapRoad는 이런 걸 할 수 있어요](#snaproad는-이런-걸-할-수-있어요) 
- [SnapRoad는 이런 기술을 사용했어요](#snaproad는-이런-기술을-사용했어요) 
- [SnapRoad의 데이터 테이블 구조](#snaproad의-데이터-테이블-구조) 
- [SnapRoad의 MVP 데이터 요청 흐름도](#snaproad의-mvp-데이터-요청-흐름도) 
- [트러블 슈팅](#트러블-슈팅) 
- [개선 목표](#개선-목표)

## [SnapRoad 이용하기](https://snap-road.vercel.app)

## 프로젝트 소개
+ 서비스명 : SnapRoad
+ 기획의도 : 개인 혹은 그룹별로 여행에 대한 추억을 남기고 서로 공유할 수 있는 프라이빗 서비스를 만들어 보고자 기획하였습니다.
+ 서비스 한줄 소개 : 여행이 끝난 뒤 추억을 기록하여 언제든지 해당 여행의 기록을 다시 찾아볼 수 있는 서비스입니다.
+ 서비스 소개
    > SnapRoad는 **혼자** 혹은 **원하는 그룹원들과** 사용할 수 있는 여행 기록 서비스입니다.  
    > **Next**와 **React**, **TypeScript**를 사용하여 개발하였으며
    > 사진과 위치를 지정해 게시물을 등록하고
    > 그룹 구성원들이 남긴 게시물에서 소통하고, 추억을 저장할 수 있는 서비스입니다!
+ 팀 노션 : [도전 A팀(팀이름)](https://www.notion.so/teamsparta/A-or-d0e6e8842b8e412c95a58cf601ad20dc)
+ 최종 MVP 스펙 : 로그인/회원가입, 회원정보 확인/수정, 그룹생성/수정, 그룹 초대수락, 이미지와 지역정보를 포함한 게시글 작성, 게시글에 댓글과 대댓글 작성

## 팀원 구성 및 역할
### 💻최유나(리더) : 게시글 작성 / 수정 페이지, 공통 컴포넌트
### 💻이원빈(부리더) : 그룹 상세 페이지 지도 / 앨범, 카카오 지도 API
### 💻전상국 : 랜딩 페이지 , 그룹 리스트 페이지 , 그룹 생성/수정 페이지, ERD
### 💻정민지 : 로그인/회원가입 페이지 , 마이페이지 , 게시글 상세 페이지, ERD
### 🖌️김은정(디자이너) : 디자인 시스템, 모바일/웹 디자인
### 🖌️서란(디자이너) : 디자인 시스템, 모바일/웹 디자인

## 개발 기간 및 작업 관리
#### MVP 개발 기간 : 2024-10-18 ~ 2024-11-07
#### User Test : 2024-11-08 ~ 2024-11-??
#### 추가 개발 기간 : 2024-11-?? ~
#### GitHub의 PullRequest 와 approve를 통해 개발 브랜치로의 지속 통합을 진행
#### Slack에 연동하여 PR생성, Comment, review, merge에 대한 상태를 관리
#### 매일 오전(개발 스크럼), 오후 스크럼(통합 스크럼)을 진행하여 지속적으로 진행상황을 공유하고, 변경사항에 대해 소통

## SnapRoad는 이런 걸 할 수 있어요
서비스 소개 사진 들어갈 자리

## SnapRoad는 이런 기술을 사용했어요
![기술의사결정](https://github.com/user-attachments/assets/b0dd07ec-5f2a-4cf0-9c8b-d2f3a2462fb5)
+ `Next JS`
  - 왜 NextJS를 사용했나?
    - 데이터 캐싱 및 쉬운 SSR지원으로 UX 상승
    - SEO를 상승시켜 서비스 노출 증가
+ `TypeScript`
  - 왜 TypeScript를 사용했나?
    - 정적 타입 검사로 안정적인 개발환경을 만들기 위해 사용
    - 타입을 미리 지정하면 개발시에도 도움을 주기 때문에 개발에 용이
      - 타입 지정에 시간이 더 사용되지만, 해당 부분은 supabase 자동 타입 생성기능을 사용하여 시간을 절약함
+ `Zustand`
  - 왜 Zustand를 사용했나?
    - 전역상태로 관리될 필요가 있는 값을 간단하게 세팅하고 사용하기 위해 선택
    - Redux는 보일러플레이트와 짧게 주어진 개발기간에 러닝커브의 문제로 제외
+ `Tanstack-query`
  - 왜 Tanstack query를 사용했나?
    - 데이터의 stale time에 따라 사용자에게 최신화된 데이터 제공
    - useQuery, useMutation, useInfiniteQuery같은 다양한 훅에서 제공해주는 isError, isPending, refetch등의 메서드를 사용해 개발에 편리함 제공
+ `Tailwind CSS` : 우수한 성능과 CSS유지보수 상승
  - 왜 Tailwind를 사용했나?
    - 유틸리티 퍼스트 방식으로 클래스 네임 충돌을 방지하고, 빠르게 스타일링이 가능함
    - 미리 정의된 유틸리티 클래스로 디자인 시스템에 맞는 일관된 스타일 유지 가능
+ `StoryBook` : 디자인 시스템에 알맞은 공통 컴포넌트 및 스타일을 원할 때 확인하여 언제나 쉽게 적용 가능
  - 왜 Storybook을 사용했나?
    - 개별 컴포넌트를 독립적으로 개발하고 일관된 UI/UX를 유지하며 컴포넌트 재사용 가능
    - 각 컴포넌트의 예제를 제공하여 시각적으로 팀원들과 공유하며 문서화 가능
+ `Supabase` : 간단한 세팅으로 관계형데이터베이스 사용 및 sql문 작성으로 원하는 로직 생성
  - 왜 Supabase를 사용했나?
    - 각 데이터끼리의 관계를 지정하여 쉽게 여러 데이터를 가져와 사용할 수 있다.
    - sql문을 작성하여 프론트에서 생기는 성능이슈를 방지할 수 있다.
+ `Kakao Map API` : 국내 지도 및 주소정보, 마커, 클러스터, 폴리라인 등 국내에 알맞은 지도 시스템 사용
  - 왜 카카오 지도를 사용했나?
    - 국내 여행에 관련된 서비스를 제공하다보니 카카오 지도 사용하여 여러 데이터를 받을 수 있음
+ `Zod` `React Hook Form`
  - 간결한 유효성 검사 통합
    - Zod의 Schema, React Hook Form의 resolver를 결합하여 폼의 유효성 검사를 쉽게 관리
    - Zod 스키마를 zodResolver로 연결하여, 설정된 상태에 따라 Zod Schema를 사용해 유효성 검사를 수행
  - 코드 가독성 및 유지 보수성 향상
    - 유효성 검사 로직과 Zod Schema 분리로 폼 관련 로직을 쉽게 이해하고 유지보수 가능
  - 타입 안전성
    - Zod Schema를 통해 생성된 타입을 활용하여 타입스크립트가 제공하는 타입 안정성을 확보
    - 잘못된 데이터 타입을 방지하고 폼 데이터를 안전하게 처리 가능

## SnapRoad의 데이터 테이블 구조
![erd](https://github.com/user-attachments/assets/8f8f924c-e2df-448d-b613-5f76429840be)

## SnapRoad의 MVP 데이터 요청 흐름도
![]()

## 트러블 슈팅
### 최유나
#### 문제상황
- 폼 제출 시 여러개의 뮤테이션이 순차적으로 실행되어야 하는 상황이 발생
  1. 포스트 생성(createPostMutation)
  2. 이미지에 생성된 포스트 ID 업데이트(updateImagesPostIdMutation) 
  3. 태그 저장(saveTagsMutation)
#### 문제 분석
- 각 뮤테이션은 이전 뮤테이션의 결과를 기반으로 실행되어야 하므로, 순서가 보장되지 않으면 작업의 의도와 다르게 동작할 수 있었습니다. 예를 들어, 포스트가 생성되기 전에 이미지나 태그를 업데이트하려고 하면 오류가 발생할 수 있었습니다.
#### 해결 방안
- 각 mutate 대신 mutateAsync를 사용하여 비동기 뮤테이션 작업을 순차적으로 실행하도록 수정했습니다. mutateAsync는 Promise를 반환하므로 await를 사용해 각 뮤테이션이 완료될 때까지 기다릴 수 있습니다. 이렇게 하면 작업 순서가 보장되며, 비동기 작업이 의도대로 수행됩니다.
    ```javascript
    const submitPost = async () => {
    try {
        // 1. 포스트 생성
        const postResult = await createPostMutation.mutateAsync(postData);

        // 2. 포스트 생성 후, 이미지에 생성된 postId 업데이트
        await updateImagesPostIdMutation.mutateAsync({
        postId: postResult.data.post_id,
        uploadSessionId,
        });

        // 3. 태그를 병렬로 저장
        await Promise.all(
        tags.map((tag) =>
            saveTagsMutation.mutateAsync({ tag, postId: postResult.data.post_id, groupId })
        )
        );

        // 작업이 성공적으로 끝난 후, 페이지 이동
        router.push(`/group/${groupId}`);
    } catch (error) {
        console.error('폼 제출 중 오류 발생:', error);
    }
    };
    ```
#### 트러블 슈팅 분석
- mutateAsync는 순차적으로 의존성 있는 비동기 작업을 처리해야 할 때 매우 유용하고, 명확한 순서 보장이 필요할 때 사용하며, 병렬 처리할 수 있는 부분은 Promise.all 등을 사용해 최적화하는 것이 좋습니다.
<br/>

### 이원빈
<br/>

### 전상국
#### 문제 상황
- 로그인한 유저가 **속한 그룹**에서 **작성된 포스트** 중 **랜덤**한 포스트들을 가져와 유저의 화면에서 보여주는 로직에서 생긴 **성능 이슈** 
  1. userId로 소속 그룹을 전체를 가져오기
  2. sort를 사용해 랜덤하게 그룹Id배열을 섞기
  3. 랜덤 그룹을 promise.allsettled를 사용해 post테이블에 post가 있는지 확인
  4. promise결과가 fulfilled인 결과만 filter
  5. filter된 배열의 이미지파일명을 Promise.all을 사용해 SignedUrl을 받아오는 로직 실행
#### 문제 분석
- 복잡한 로직을 프론트에서 처리하며 여러 요청을 페이지 첫 로딩에 보내어 1회 HTTP요청 한계(6개)에 걸리고(첫 로딩 시 해당 페이지에서 요청이 17개), 그에따라 첫 데이터 요청에 3~4초가 걸리는 성능이슈가 발생함 
![성능개선이전](https://github.com/user-attachments/assets/74b5cfb7-941a-4c8f-9fc1-ef8f33f92f88)
#### 해결 방안
- sql을 활용한 supabase function을 만들어 프론트에서 진행하면 성능 문제를 일으키는 요청들을 백엔드(supabase)에서 처리하도록 최적화 진행
    ```sql
    CREATE OR REPLACE FUNCTION get_user_posts_by_user_id(input_user_id uuid)
    RETURNS TABLE(
    post_thumbnail_image text,
    post_address text,
    post_id uuid,
    created_at timestamp with time zone,
    group_id uuid
    )
    LANGUAGE plpgsql
    AS $$
    begin
    return query
        select p.post_thumbnail_image, p.post_address, p.post_id, p.created_at, p.group_id
        from public.posts p
        where p.group_id IN (
        select ug.group_id
        from public.user_group ug
        where ug.user_id = input_user_id
        )
        order by random()
        limit 5;
    end;
    $$;
    ```
    ```javascript
    async () => {
        const { data } = await browserClient.auth.getUser();
        let dataList: PostDataListType = [];
        if (data.user?.id) {
        const userId = data.user.id;
        const { data: postDataList }: { data: PostDataListType } = await browserClient.rpc(
            'get_user_posts_by_user_id',
            { input_user_id: userId },
        );
        if (postDataList?.length) {
            const imgNameArray = postDataList.map((postData) => `${postData.group_id}/${postData.post_thumbnail_image}`);
            const signedUrls = await getSignedImgUrls('tour_images', 60 * 60, imgNameArray);
            if (signedUrls) {
            dataList = postDataList.map((data, idx) => ({
                ...data,
                post_thumbnail_image: signedUrls[idx].signedUrl,
            }));
            }
        }
        }
        return dataList;
    }
    ```
#### 트러블 슈팅 분석
- 최적화 이전 17개에 달하는 요청이 sql문으로 최적화 후 7개로 줄였으며 최대 요청시간도 0.8초로 최적화 완료
![성능개선결과](https://github.com/user-attachments/assets/e2133ae7-0ba8-41af-b581-0dfeea98c9fb)
<br/>

### 정민지
#### 문제상황
- 소셜 로그인 시 각 기관에서 제공하는 사용자의 이름을 public.profiles 에 저장하기 위해 트리거를 설정해주어야하는데 각 기관마다 사용자 이름을 제공하는 필드명이 달랐다.

#### 문제 분석
- 각 기관에서 어떤 응답으로 사용자의 정보를 주는지 분석
- 분석 결과 full_name, user_name 등 다양했음

#### 해결 방안
```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles(
    user_id, 
    user_email, 
    user_nickname
  )values (
    new.id, 
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_name',new.raw_user_meta_data->>'user_nickname')

  );

  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row 
  execute function public.handle_new_user();
```

- 트리거 함수 만들 때 수파베이스에서 제공하는 coalesce 를 사용하여 모든 경우에 대비하도록 함

<br/>

## 개선 목표

### 최유나
1. 게시글 수정 할때 어떻게 임시 저장 할 것이며 받아와야하는지
2. 데이터 별 유저/그룹별로 id 필터링해서 주스탄드 처리 해야하는데 어떻게 할 것인가
3. 이미지 올리는데 너무 오래걸리는데 이건 어떻게 처리해야하는지

### 이원빈
1. 지도 첫 화면에서 게시물들이 다 보이게 지도 위치 재조정
2. 지도 마커 prefetch
3. 그룹 앨범 토글버튼 hover시 prefetch

### 전상국
1. 이미지 crop(그룹이나 게시글에서 이미지 업로드시 crop 라이브러리 사용하여 이미지 정사각형으로 잘라 업로드하도록 변경)
2. 이미지 최적화(용량제한 혹은 업로드시 확장자 변경)
3. signedurl 만료와 캐싱 관련 문제(tanstackquery의 staletime과 signedurl의 유효기간을 적절히 조정하여 문제 방지)

### 정민지
1. 댓글 대댓글 구조 개선(부모,자식 따로 렌더링하도록 했는데 유지보수와 확장성을 위해 재귀적 구조로 개선)
2. signedurl 만료와 캐싱 관련 문제(tanstackquery의 staletime과 signedurl의 유효기간을 적절히 조정하여 문제 방지)
