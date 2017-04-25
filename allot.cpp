#include<bits/stdc++.h>

using namespace std;

struct member
{
    string name;
    vector<int>vec;
    int many;
    member():vec(10*7+1, 1), many(0) {}
};

struct config
{
    int row, col;//row是行，col是列
    int m; //m是一节课安排的最多值班人数
};

vector<member> all;
config conf;


void init()
{
    cin >> conf.row >> conf.col;
    cin >> conf.m;
}

void input()
{
    member a;
    while(cin >> a.name)
    {
        for(int i = 0; i < conf.row * conf.col; ++ i)
            cin >> a.vec[i];
        all.push_back(a);
    }
}

void find_noclass_students(vector<vector<int> >&No_class)
{
    for(int i = 0; i < all.size(); ++ i)
    {
        for(int j = 0; j < conf.row * conf.col; ++ j)
        {
            if(all[i].vec[j] == 0)
                No_class[j].push_back(i);
        }
    }
//    for(int i = 0; i < conf.row * conf.col; ++ i)
//    {
//        cout << i << " " << No_class[i].size() << endl;
//        for(auto &j:No_class[i])
//            cout << j << " ";
//        cout << endl;
//   }
}

vector<int> find_best_arrange(vector<int> &arr)
{
    int tot = arr.size();
    vector<bool>visited(tot, false);
    vector<int> vec;
    for(int i = 0; i < conf.m; ++ i)
    {
        int v = -1;
        for(int j = 0; j < tot; ++ j)
        {
            int t = arr[j];
            if(visited[j] == false && (v == -1 || all[t].many < all[arr[v]].many))
                v = j;
        }
        if(v == -1)
            break;
        visited[v] = true;

        all[arr[v]].many += 1;
        vec.push_back(arr[v]);
    }
    return vec;
}

void BinaryMatch()
{
    vector<vector<int> >No_class(conf.row*conf.col+1);

    //将所有没课的情况全部记录在一个课表上
    find_noclass_students(No_class);

    //先排可值班人数最少的时间。然后在安排人数多的时间
    vector<bool> visited(conf.row*conf.col+1, false);
    for(int i = 0; i < conf.row * conf.col; ++ i)
    {
        //找可值班人数最少的时间
        int mx = -1;
        for(int j = 0; j < conf.row * conf.col; ++ j)
        {
            if(visited[j] == false && (mx == -1 || No_class[j].size() < No_class[mx].size()))
                mx = j;
        }

        visited[mx] = true;

        //找这节课最优的安排方案
        No_class[mx] = find_best_arrange(No_class[mx]);
//        cout << mx << " " << No_class[mx].size() << " ";
//        for(auto &i:No_class[mx])
//            cout << i << " ";
//        cout << endl;
    }
    vector<string> duty(conf.row * conf.col);

    for(int i = 0; i < conf.row * conf.col; ++ i)
    {
        for(int j = 0; j < No_class[i].size(); ++ j)
        {
            if(j != 0)
                duty[i] += ',';
            int t = No_class[i][j];
            duty[i] += all[t].name;
        }
    }
    cout << conf.row << " " << conf.col << endl;
    for(int i = 0; i < conf.row; ++ i)
    {
        for(int j=0; j < conf.col; ++ j)
            cout << duty[i*conf.col + j] << " ";
        cout << endl;
    }
}

int main()
{
    ios::sync_with_stdio(false);

    init();

    input();

    BinaryMatch();

    return 0;
}
