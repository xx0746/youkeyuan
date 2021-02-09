<template>
  <div
    v-loading="fileLoading"
    :element-loading-text="progress"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-form ref="form" :model="form" label-width="90px" style="width:80%;margin-left:30px;">
      <el-form-item label="所属资源目录" label-width="120px">
        <el-cascader
          :options="options"
          filterable
          change-on-select
          expand-trigger="hover"
          disabled
          @change="sel"
          v-model="values"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="选择文件" label-width="120px">
        <!-- <global-uploader></global-uploader> -->
        <div>
          <h5>已有文件列表</h5>
          <ul class="file_list">
            <li v-for="(file, index) in oldFilesList" :key="index">
              <span :class="file.fileName | fileIcon"></span>
              <a class="file_name" :title="file.fileName">{{file.fileName}}</a>
              <span class="file_actions" @click="review(file)"><i class="el-icon-view"></i></span>
              <span class="file_close" @click="delFile(index)"><i class="el-icon-close"></i></span>
            </li>
            <div class="no-file" v-if="!oldFilesList.length">
              <i class="iconfont icon-empty-file" style="padding-left: 16px"></i> 暂无待上传文件
            </div>
          </ul>
        </div>
      </el-form-item>
      <!--论文-->
      <div id="loc1">
        <el-form ref="form2" :model="form2" label-width="120px" :rules="form2list">
          <el-form-item label="下载是否审核" label-width="120px" prop>
            <template>
              <el-radio v-model="form2.dataOne" label="1">是</el-radio>
              <el-radio v-model="form2.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item prop="thesisTitle" label="论文题目" label-width="120px">
            <el-input maxlength="50" clearable v-model="form2.thesisTitle"></el-input>
          </el-form-item>

          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="form2.thesisKey "></el-input>
          </el-form-item>
          <el-form-item label="刊号" label-width="120px">
            <el-input v-model="form2.thesisKh "></el-input>
          </el-form-item>
          <el-form-item label="刊物名称" label-width="120px">
            <el-input v-model="form2.thesisKwmc "></el-input>
          </el-form-item>
          <el-form-item label="摘要" label-width="120px">
            <el-input v-model="form2.thesisAbstract"></el-input>
          </el-form-item>
          <el-form-item label="被引文献" label-width="120px">
            <el-input v-model="form2.thesisLiterature"></el-input>
          </el-form-item>
          <el-form-item label="学科专业名称" label-width="120px">
            <el-input v-model="form2.thesisSubjectName"></el-input>
          </el-form-item>
          <el-form-item label="类别及等级" label-width="120px">
            <el-input v-model="form2.thesisType"></el-input>
          </el-form-item>
          <el-form-item label="字数" label-width="120px" prop="thesisWordCount">
            <el-input v-model.number="form2.thesisWordCount" class="numberInput" type="number"></el-input>
          </el-form-item>
          <el-form-item label="发表时间" label-width="120px">
            <div class="block">
              <el-date-picker
                v-model="form2.thesisPublishTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期时间"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="是否获奖" style="display:none" label-width="120px">
            <el-radio-group v-model="form2.thesisAward" @change="lunwencailiao">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <div id="lunwencailiao" style="display:none">
            <el-form-item id="aw" label="证明材料" label-width="120px">
              <el-upload
                class="upload-demo"
                ref="lunwen2"
                :on-change="beforeChange"
                :header="headerType"
                :action="actionUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :with-credentials="true"
                :onSuccess="upload2"
                :auto-upload="false"
              >
                <el-button id="aw1" slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button
                  id="aw2"
                  style="margin-left: 10px;"
                  size="small"
                  type="primary2"
                  @click="lunwen2"
                >上传到服务器</el-button>
              </el-upload>
            </el-form-item>
          </div>
          <el-form-item label="院或院科研人员署名排名" style="display:none" label-width="180px">
            <el-input v-model="form2.thesisSignature"></el-input>
          </el-form-item>
          <el-form-item label="院第一完成人" style="display:none" label-width="120px">
            <el-input v-model="form2.thesisFirstDone"></el-input>
          </el-form-item>
          <el-form-item label="院参加人员" style="display:none" label-width="120px">
            <el-input v-model="form2.thesisParticipants"></el-input>
          </el-form-item>
          <el-form-item label="资源采集时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker v-model="form2.acqTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="资源采集人" style="display:none" label-width="120px">
            <el-input v-model="form2.acqUser"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="resetRelunwen"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--图书-->
      <div id="loc4" class="hidden">
        <el-form ref="form4" :model="form4" label-width="120px" :rules="form4list">
          <el-form-item label="下载是否审核" label-width="120px" prop>
            <template>
              <el-radio v-model="form4.dataOne" label="1">是</el-radio>
              <el-radio v-model="form4.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item prop="booksName" label="图书名称" label-width="120px">
            <el-input clearable v-model="form4.booksName"></el-input>
          </el-form-item>

          <el-form-item label="作者" label-width="120px">
            <el-input maxlength="50" v-model="form4.booksAuthor"></el-input>
          </el-form-item>
          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="form4.booksKey"></el-input>
          </el-form-item>
          <el-form-item label="分类号" label-width="120px">
            <el-input v-model="form4.booksTypeNumber"></el-input>
          </el-form-item>
          <el-form-item label="摘要" label-width="120px">
            <el-input v-model="form4.booksAbstract"></el-input>
          </el-form-item>
          <el-form-item label="DOI" label-width="120px">
            <el-input v-model="form4.booksDoi"></el-input>
          </el-form-item>
          <el-form-item label="单位" label-width="120px">
            <el-input v-model="form4.booksCompany"></el-input>
          </el-form-item>
          <el-form-item label="出版社" label-width="120px">
            <el-input v-model="form4.booksPress"></el-input>
          </el-form-item>
          <el-form-item label="出版时间" label-width="120px">
            <div class="block">
              <el-date-picker v-model="form4.booksPublicTime " type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="类型" label-width="120px">
            <el-input v-model="form4.booksType"></el-input>
          </el-form-item>
          <el-form-item label="第几版" label-width="120px">
            <el-input v-model="form4.booksGrade"></el-input>
          </el-form-item>
          <el-form-item label="字数" label-width="120px" prop="booksBumber">
            <el-input v-model.number="form4.booksBumber"></el-input>
          </el-form-item>
          <el-form-item label="院或院科研人员署名排名" style="display:none" label-width="180px">
            <el-input v-model="form4.booksSignature"></el-input>
          </el-form-item>
          <el-form-item label="院第一完成人" style="display:none" label-width="120px">
            <el-input v-model="form4.booksFirstDone"></el-input>
          </el-form-item>
          <el-form-item label="院参加人员" style="display:none" label-width="120px">
            <el-input v-model="form4.booksParticipants"></el-input>
          </el-form-item>
          <el-form-item label="资源采集时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker v-model="form4.acqTime " type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="资源采集人" style="display:none" label-width="120px">
            <el-input v-model="form4.acqUser"></el-input>
          </el-form-item>

          <el-form-item style>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="resetRebook"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--成果-->
      <div id="loc3" class="hidden">
        <el-form ref="form3" :model="form3" label-width="120px" :rules="form3list">
          <el-form-item label="下载是否审核" label-width="120px" prop>
            <template>
              <el-radio v-model="form3.dataOne" label="1">是</el-radio>
              <el-radio v-model="form3.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item prop="achiTitle" label="成果标题" label-width="120px">
            <el-input maxlength="50" clearable v-model="form3.achiTitle"></el-input>
          </el-form-item>

          <el-form-item label="类别及等级" label-width="120px">
            <el-input v-model="form3.achiType"></el-input>
          </el-form-item>
          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="form3.achiKey"></el-input>
          </el-form-item>
          <el-form-item label="成果简介" label-width="120px">
            <el-input v-model="form3.achiAbstract"></el-input>
          </el-form-item>
          <el-form-item label="中图分类号" style="display:none" label-width="120px">
            <el-input v-model="form3.achiZtflh"></el-input>
          </el-form-item>
          <el-form-item label="学科分类号" style="display:none" label-width="120px">
            <el-input v-model="form3.achiXkflh"></el-input>
          </el-form-item>
          <el-form-item label="发表时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker v-model="form3.achiFbsj " type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="报刊名称" style="display:none" label-width="120px">
            <el-input v-model="form3.achiKwmc"></el-input>
          </el-form-item>
          <el-form-item label="刊号" style="display:none" label-width="120px">
            <el-input v-model="form3.achiKh"></el-input>
          </el-form-item>
          <el-form-item label="字数" style="display:none" label-width="120px" prop="achiWordCount">
            <el-input v-model.number="form3.achiWordCount"></el-input>
          </el-form-item>
          <el-form-item label="媒体平台" style="display:none" label-width="120px">
            <el-input v-model="form3.achiMtpt"></el-input>
          </el-form-item>
          <el-form-item label="报到时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker v-model="form3.achiBdsj" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="报到方式" style="display:none" label-width="120px">
            <el-input v-model="form3.achiBdfs"></el-input>
          </el-form-item>
          <el-form-item label="交流时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker v-model="form3.achiJlsj" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="交流地点" style="display:none" label-width="120px">
            <el-input v-model="form3.achiJldd"></el-input>
          </el-form-item>
          <el-form-item label="活动内容" style="display:none" label-width="120px">
            <el-input v-model="form3.achiHdnr"></el-input>
          </el-form-item>
          <el-form-item label="活动时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker v-model="form3.achiHdsj" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="活动地点" style="display:none" label-width="120px">
            <el-input v-model="form3.achiHddd"></el-input>
          </el-form-item>
          <el-form-item label="批示领导姓名" style="display:none" label-width="120px">
            <el-input v-model="form3.achiPsld"></el-input>
          </el-form-item>
          <el-form-item label="是否获奖" style="display:none" label-width="120px">
            <el-radio-group v-model="form3.achiAward" @change="chengguocailiao">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item id="cw" style="display:none" label="证明材料" label-width="120px">
            <el-upload
              class="upload-demo"
              ref="chengguo2"
              :on-change="beforeChange"
              :header="headerType"
              :action="actionUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :with-credentials="true"
              :onSuccess="upload5"
              :auto-upload="false"
            >
              <el-button id="cw1" slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button
                id="cw2"
                style="margin-left: 10px;"
                size="small"
                type="primary2"
                @click="chengguo2"
              >上传到服务器</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="院或院科研人员署名排名" style="display:none" label-width="180px">
            <el-input v-model="form3.achiSignature "></el-input>
          </el-form-item>
          <el-form-item label="院第一完成人" style="display:none" label-width="120px">
            <el-input v-model="form3.achiFirstDone "></el-input>
          </el-form-item>
          <el-form-item label="院参加人员" style="display:none" label-width="120px">
            <el-input v-model="form3.achiParticipants "></el-input>
          </el-form-item>
          <el-form-item label="资源采集时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker v-model="form3.acqTime " type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="资源采集人" style="display:none" label-width="120px">
            <el-input v-model="form3.acqUser "></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="resetRechengguo"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--案例库-->
      <div id="loc2" class="hidden">
        <el-form ref="form5" :model="form5" label-width="120px" :rules="form5list">
          <el-form-item label="下载是否审核" label-width="120px" prop>
            <template>
              <el-radio v-model="form5.dataOne" label="1">是</el-radio>
              <el-radio v-model="form5.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item label="案例名称" prop="caseTitle" label-width="120px">
            <el-input maxlength="50" clearable v-model="form5.caseTitle"></el-input>
          </el-form-item>

          <el-form-item label="案例类别" label-width="120px" prop="caseType">
            <el-input v-model.number="form5.caseType"></el-input>
          </el-form-item>
          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="form5.caseKey"></el-input>
          </el-form-item>
          <el-form-item label="院第一完成人" style="display:none" label-width="120px">
            <el-input v-model="form5.caseFirstdone"></el-input>
          </el-form-item>
          <el-form-item label="院参加人员" style="display:none" label-width="120px">
            <el-input v-model="form5.caseParticipants"></el-input>
          </el-form-item>
          <el-form-item label="资源采集时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker v-model="form5.acqTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="资源采集人" style="display:none" label-width="120px">
            <el-input v-model="form5.acqUser"></el-input>
          </el-form-item>

          <el-form-item style>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="resetReanliku"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--知识产权-->
      <div id="loc5" class="hidden">
        <el-form ref="form6" :model="form6" label-width="124px" :rules="form6list">
          <el-form-item label="下载是否审核" label-width="124px" prop>
            <template>
              <el-radio v-model="form6.dataOne" label="1">是</el-radio>
              <el-radio v-model="form6.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="124px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item label="知识产权名称" prop="patentName" label-width="124px">
            <el-input maxlength="50" clearable v-model="form6.patentName"></el-input>
          </el-form-item>

          <el-form-item label="摘要" label-width="124px">
            <el-input v-model="form6.patentAbstract"></el-input>
          </el-form-item>
          <el-form-item label="关键词" label-width="124px">
            <el-input v-model="form6.patentKey"></el-input>
          </el-form-item>
          <el-form-item label="申请号（专利号）" label-width="124px">
            <el-input v-model="form6.patentApplyNumber"></el-input>
          </el-form-item>
          <el-form-item label="申请人" label-width="124px">
            <el-input v-model="form6.patentApplyMan"></el-input>
          </el-form-item>
          <el-form-item label="申请时间" label-width="124px">
            <div class="block">
              <el-date-picker v-model="form6.patentApplyTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="类别" label-width="120px">
            <el-select v-model="form6.patentType" placeholder="请选择类别" clearable @change="tchange">
              <el-option label="专利" value="1"></el-option>
              <el-option label="软件著作权" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专利类别" label-width="120px" v-show="isZhuanLi">
            <el-select v-model="form6.patentMainType" placeholder="请选择专利类别" clearable>
              <el-option label="发明专利" value="1"></el-option>
              <el-option label="外观专利" value="2"></el-option>
              <el-option label="实用新型" value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否获奖" style="display:none" label-width="124px">
            <el-radio-group v-model="form6.patentAward" @change="zhishichanquan">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item id="xw" style="display:none" label="上传证书" label-width="124px">
            <el-upload
              class="upload-demo"
              ref="zhishichanquan2"
              :on-change="beforeChange"
              :header="headerType"
              :action="actionUrl"
              :on-preview="handlePreview"
              :with-credentials="true"
              :on-remove="handleRemove"
              :onSuccess="upload8"
              :auto-upload="false"
            >
              <el-button id="xw1" slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button
                id="xw2"
                style="margin-left: 10px;"
                size="small"
                type="primary2"
                @click="zhishichanquan2"
              >上传到服务器</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="院或院科研人员署名排名" style="display:none" label-width="180px">
            <el-input v-model="form6.patentSignature"></el-input>
          </el-form-item>
          <el-form-item label="院第一完成人" style="display:none" label-width="124px">
            <el-input v-model="form6.patentFirstDone"></el-input>
          </el-form-item>
          <el-form-item label="院参加人员" style="display:none" label-width="124px">
            <el-input v-model="form6.patentParticipants"></el-input>
          </el-form-item>
          <el-form-item label="资源采集时间" style="display:none" label-width="124px">
            <div class="block">
              <el-date-picker v-model="form6.acqTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="资源采集人" style="display:none" label-width="124px">
            <el-input v-model="form6.acqUser"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="resetRezhishichanquan"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--新闻-->
      <div id="loc6" class="hidden">
        <el-form ref="news" :model="news" label-width="120px" :rules="newslist">
          <el-form-item label="新闻标题" label-width="120px">
            <el-input clearable v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="摘要" label-width="120px">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="作者" label-width="120px">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="资源采集时间" label-width="120px">
            <div class="block">
              <el-date-picker v-model="newsDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-form-item>

          <el-form-item label="资源采集人员" label-width="120px">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item style>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="addxinwen"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--标准-->
      <div id="loc7" class="hidden">
        <el-form ref="standard" :model="standard" label-width="120px" :rules="standardlist">
          <el-form-item label="下载是否审核" label-width="120px" prop>
            <template>
              <el-radio v-model="standard.dataOne" label="1">是</el-radio>
              <el-radio v-model="standard.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item label="标准名称" label-width="120px" prop="standardName">
            <el-input maxlength="50" clearable v-model="standard.standardName"></el-input>
          </el-form-item>

          <el-form-item label="标准类别" label-width="120px">
            <el-select v-model="standard.standardType" placeholder="请选择标准类别">
              <el-option label="国标" value="国标"></el-option>
              <el-option label="行标" value="行标"></el-option>
              <el-option label="企业" value="企业"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="standard.standardKey "></el-input>
          </el-form-item>
          <el-form-item label="摘要" label-width="120px">
            <el-input v-model="standard.standardAbstract "></el-input>
          </el-form-item>
          <el-form-item label="标准号" label-width="120px">
            <el-input v-model="standard.standardNumber "></el-input>
          </el-form-item>
          <!-- <el-form-item label="发表时间" label-width="120px">
            <div class="block">
              <el-date-picker
                v-model="form2.thesisPublishTime"
                type="date"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </el-form-item>-->
          <el-form-item label="发布日期" label-width="120px">
            <div class="block">
              <el-date-picker v-model="standard.issueDate " type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="实施日期" label-width="120px">
            <div class="block">
              <el-date-picker v-model="standard.implementDate " type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="发布单位名称" label-width="120px">
            <el-input v-model="standard.issueCompany "></el-input>
          </el-form-item>
          <el-form-item label="出版单位名称" label-width="120px">
            <el-input v-model="standard.publishCompany "></el-input>
          </el-form-item>
          <el-form-item label="中国标准分类号" label-width="120px">
            <el-input v-model="standard.standardTypeNumber "></el-input>
          </el-form-item>
          <el-form-item label="起草人" label-width="120px">
            <el-input v-model="standard.draftsman "></el-input>
          </el-form-item>
          <el-form-item label="院或院科研人员署名排名" style="display:none" label-width="180px">
            <el-input v-model="standard.standardSignature "></el-input>
          </el-form-item>
          <el-form-item label="院第一完成人" style="display:none" label-width="120px">
            <el-input v-model="standard.standardFirstDone "></el-input>
          </el-form-item>
          <el-form-item label="院参加人员" style="display:none" label-width="120px">
            <el-input v-model="standard.standardParticipants "></el-input>
          </el-form-item>
          <el-form-item label="资源采集时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker v-model="standard.acqTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="资源采集人" style="display:none" label-width="120px">
            <el-input v-model="standard.acqUser"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="resetRestandard"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--实验室-->
      <div id="loc8" class="hidden">
        <el-form ref="lab" :model="lab" label-width="120px" :rules="lablist">
          <el-form-item label="下载是否审核" label-width="120px" prop>
            <template>
              <el-radio v-model="lab.dataOne" label="1">是</el-radio>
              <el-radio v-model="lab.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item label="实验室名称" label-width="120px" prop="libTitle">
            <el-input clearable v-model="lab.libTitle"></el-input>
          </el-form-item>

          <el-form-item label="研究成果" label-width="120px">
            <el-input v-model="lab.libAchievement "></el-input>
          </el-form-item>
          <el-form-item label="研究形成时间" label-width="120px">
            <div class="block">
              <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="lab.libAchievementTime "></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="lab.libKey "></el-input>
          </el-form-item>
          <el-form-item label="实验室负责人" label-width="120px">
            <el-input v-model="lab.libChargePerson "></el-input>
          </el-form-item>
          <el-form-item label="研究成果应用情况" label-width="120px">
            <el-input v-model="lab.libAchievementApply "></el-input>
          </el-form-item>
          <el-form-item label="研究成果参加人" label-width="120px">
            <el-input v-model="lab.libAchievementParticipants"></el-input>
          </el-form-item>
          <el-form-item label="负责人" label-width="120px">
            <el-input v-model="lab.chargePerson "></el-input>
          </el-form-item>
          <el-form-item label="资源采集时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="lab.acqTime "></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="资源采集人" label-width="120px" style="display:none">
            <el-input v-model="lab.acqUser "></el-input>
          </el-form-item>

          <el-form-item style>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="resetRelab"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--图片-->
      <div id="loc9" class="hidden">
        <el-form ref="picture" :model="picture" label-width="120px" :rules="picturelist">
          <el-form-item label="下载是否审核" label-width="120px" prop>
            <template>
              <el-radio v-model="picture.dataOne" label="1">是</el-radio>
              <el-radio v-model="picture.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item label="图片名称" label-width="120px" prop="picName">
            <el-input clearable v-model="picture.picName"></el-input>
          </el-form-item>

          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="picture.picKey"></el-input>
          </el-form-item>
          <el-form-item label="图片描述" label-width="120px">
            <el-input v-model="picture.picDescribe"></el-input>
          </el-form-item>
          <el-form-item label="拍摄时间" label-width="120px">
            <div class="block">
              <el-date-picker type="date" v-model="picture.shotDate" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="版权" label-width="120px">
            <el-input v-model="picture.copyright"></el-input>
          </el-form-item>

          <!-- <el-form-item label="部门" label-width="120px" prop="depId">
            <el-cascader
              v-model="picture.depId"
              :options="orgList"
              filterable
              placeholder="请选择部门"
              change-on-select
              :show-all-levels="false"
              >
            </el-cascader>
          </el-form-item>-->

          <el-form-item label="院或院科研人员署名排名" style="display:none" label-width="180px">
            <el-input v-model="picture.picSignature"></el-input>
          </el-form-item>
          <el-form-item label="院第一完成人" style="display:none" label-width="120px">
            <el-input v-model="picture.picFirstDone"></el-input>
          </el-form-item>
          <el-form-item label="院参加人员" style="display:none" label-width="120px">
            <el-input v-model="picture.picParticipants"></el-input>
          </el-form-item>
          <el-form-item label="资源采集时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="picture.acqTime"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="资源采集人" style="display:none" label-width="120px">
            <el-input v-model="picture.acqUser"></el-input>
          </el-form-item>

          <el-form-item style>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="resetRepicture"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--视频-->
      <div id="loc10" class="hidden">
        <el-form ref="videoForm" :model="videoForm" label-width="120px" :rules="videoFormlist">
          <el-form-item label="下载是否审核" label-width="120px" prop>
            <template>
              <el-radio v-model="videoForm.dataOne" label="1">是</el-radio>
              <el-radio v-model="videoForm.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item label="视频名称" label-width="120px" prop="videoName">
            <el-input clearable v-model="videoForm.videoName"></el-input>
          </el-form-item>

          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="videoForm.videoKey"></el-input>
          </el-form-item>
          <el-form-item label="院或院科研人员署名排名" style="display:none" label-width="120px">
            <el-input v-model="videoForm.videoSignature"></el-input>
          </el-form-item>
          <el-form-item label="院第一完成人" style="display:none" label-width="120px">
            <el-input v-model="videoForm.videoFirstDone"></el-input>
          </el-form-item>
          <el-form-item label="院参加人员" style="display:none" label-width="120px">
            <el-input v-model="videoForm.videoParticipantsl"></el-input>
          </el-form-item>
          <el-form-item label="视频描述" label-width="120px">
            <el-input v-model="videoForm.videoDescribe"></el-input>
          </el-form-item>
          <el-form-item label="拍摄时间" label-width="120px">
            <div class="block">
              <el-date-picker type="date" v-model="videoForm.shotDate" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="版权" label-width="120px">
            <el-input v-model="videoForm.copyright"></el-input>
          </el-form-item>

          <!-- <el-form-item label="部门" label-width="120px" prop="depId">
            <el-cascader
              v-model="videoForm.depId"
              :options="picList"
              filterable
              placeholder="请选择部门"
              change-on-select
              :show-all-levels="false"
              >
            </el-cascader>
          </el-form-item>-->
          <!-- <el-select
            v-model="videoForm.depId"
            placeholder="请选择部门"
            style="width:100%"
            @change="getVideoOrg(videoForm.depId)"
          >
            <el-option
              v-for="item in picList"
              :key="item.ORGID"
              :label="item.ORGNAME"
              :value="item.ORGID"
            ></el-option>
          </el-select>-->

          <el-form-item label="资源采集时间" style="display:none" label-width="120px">
            <div class="block">
              <el-date-picker type="date" v-model="videoForm.acqTime" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="资源采集人" style="display:none" label-width="120px">
            <el-input v-model="videoForm.acqUser"></el-input>
          </el-form-item>

          <el-form-item style>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="resetRevideoForm"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--文件-->
      <div id="loc17" class="hidden">
        <el-form ref="importForm" :model="importForm" label-width="120px" :rules="importFormlist">
          <el-form-item label="下载是否审核" label-width="120px" prop>
            <template>
              <el-radio v-model="importForm.dataOne" label="1">是</el-radio>
              <el-radio v-model="importForm.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="文件题目" label-width="120px" prop="importTitle">
            <el-input maxlength="50" clearable v-model="importForm.importTitle"></el-input>
          </el-form-item>

          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="importForm.importKey"></el-input>
          </el-form-item>

          <el-form-item style>
            <el-button type="primary4" style="margin-left:15%">文件维护</el-button>
            <el-button
              type="primary"
              @click="resetReImportForm"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--报告-->
      <div id="loc18" class="hidden">
        <el-form ref="researchForm" :model="researchForm" label-width="120px" :rules="researchFormlist">
          <el-form-item label="下载是否审核" label-width="120px" required>
            <template>
              <el-radio v-model="researchForm.dataOne" label="1">是</el-radio>
              <el-radio v-model="researchForm.dataOne" label="2">否</el-radio>
            </template>
          </el-form-item>
          <el-form-item prop="tally" label="标签" label-width="120px">
            <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
              <el-option
                v-for="item in tallyData.classify1"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>

            <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
              <el-option
                v-for="item in tallyData.classify2"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <div class="tagbox">
              <el-tag
                v-for="tag in tags"
                :key="tag.index"
                closable
                size="small"
                :type="tag.type"
                @close="handleCloseTag(tag)"
              >{{tag.name}}</el-tag>
            </div>
          </el-form-item>

          <el-form-item label="报告题目" label-width="120px" prop="researchTitle">
            <el-input maxlength="50" clearable v-model="researchForm.researchTitle"></el-input>
          </el-form-item>

          <el-form-item label="关键词" label-width="120px">
            <el-input v-model="researchForm.researchKey"></el-input>
          </el-form-item>

          <el-form-item style>
            <el-button
              type="primary"
              style="margin-left:25%"
              @click="resetReResearchForm"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-form>
  </div>
</template>
<script>
import { Loading } from 'element-ui';
import {
  resetRechengguo,
  resetRelunwen,
  resetRewenzhang,
  resetReanliku,
  resetRebook,
  resetRezhishichanquan,
  resetRestandardInterface,
  resetRelabInterface,
  resetRepictureInterface,
  resetRevideoFormInterface,
  resetReimportFormInterface,
  resetReresearchFormInterface,
  getFromMenuId
} from "@/api/resetReupload";
import {
  getlabelListAllData,
  getTagListAllData,
  getTagcontentData,
  sendLunwenUploadFile
} from "@/api/manualupload";
import {
  labelListAllInterface,
  getLeftTreeInterface,
  getresource,
  getreSourceFiles,
  getLabels
} from "@/api/resource_list";
import { getOrgListInterface } from "@/api/list";
import Bus from "@/components/uploader/js/bus";
import globalUploader from "@/components/uploader/globalUploader.vue";
import { isInteger,typePureSpace } from "@/utils/elValidate"; // 引入自定义校验方法

export default {
  name: "resetre-upload",
  components: {
    globalUploader
  },
  props: ["datas"],
  data() {
    return {
       // 预览
      src: "",
      fileName: "",
      filelistdata: true,
      // 上传组件上传动画
      fileLoading: false,
      progress: "0%",
      // 下拉选择库
      value: "",
      values: [],
      radio: "1",
      dataOne: "2",
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      actionUrl: "http://132.10.10.42:8765/yzyjy/thesis/get/url",
      options: [],
      lunwenFileList: [],
      // 标签选择级联下拉数据
      tallyData: {
        classify1: [],
        classify2: []
      },
      tallyValue1: "",
      tallyValue2: "",
      tallyValueArr: [],
      tallyName1: "",
      tallyName2: "",
      tallyNameArr: [],
      tags: [],
      tagsType: "success",

      leibie: "",
      newsDate: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        dataOne: "2",
        dataTwo: "",
        menuId: null,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      },

      form2: {
        thesisTitle: "",
        thesisKey: "",
        thesisType: null,
        thesisKh: "",
        thesisKwmc: "",
        thesisAbstract: "",
        thesisLiterature: "",
        thesisSubjectName: "",
        thesisWordCount: null,
        thesisPublishTime: "",
        thesisEvidence: "",
        thesisFirstDone: "",
        thesisParticipants: "",
        thesisSignature: "",
        thesisFile: "",
        acqTime: "",
        acqUser: "",
        thesisAward: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 1,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      },
      form2list: {
        thesisTitle: [
          { required: true, message: "请输入论文题目", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ],
        thesisWordCount: [
          { required: false,validator: isInteger,message: "请输入正整数", trigger: "blur" }
          // {
          //   type: "number",
          //   message: "此处应该输入数字！",
          //   trigger: ["blur", "input"]
          // }
        ]
      },
      form3list: {
        achiTitle: [
          { required: true, message: "请输入成果标题", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ],
        achiWordCount: [
          { required: false,validator: isInteger,message: "请输入正整数", trigger: "blur" }]
      },

      form4list: {
        booksName: [
          { required: true, message: "请输入图书名称", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ],
        booksBumber: [
          { required: false,validator: isInteger,message: "请输入正整数", trigger: "blur" }]
      },
      form5list: {
        caseTitle: [
          { required: true, message: "请输入案例标题", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ] /*,
          caseType:[{type: 'number', message: '请输入数字'}],*/
      },
      form4: {
        acqTime: "",
        acqUser: "",
        booksAbstract: "",
        booksAuthor: "",
        booksBumber: "",
        booksCompany: "",
        booksDoi: "",
        booksFile: "",
        booksFirstDone: "",
        booksGrade: "",
        booksKey: "",
        booksName: "",
        booksParticipants: "",
        booksPress: "",
        booksPublicTime: "",
        booksSignature: "",
        booksType: null,
        booksTypeNumber: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 4,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      },

      form3: {
        achiAbstract: "",
        achiAward: "2",
        achiBdfs: "",
        achiBdsj: "",
        achiEvidence: "",
        achiFbsj: "",
        achiFile: "",
        achiFirstDone: "",
        achiHddd: "",
        achiHdnr: "",
        achiHdsj: "",
        achiJldd: "",
        achiJlsj: "",
        achiKey: "",
        achiKh: "",
        achiKwmc: "",
        achiMtpt: "",
        achiParticipants: "",
        achiPsld: "",
        achiSignature: "",
        achiTitle: "",
        achiType: null,
        achiWordCount: "",
        achiXkflh: "",
        achiZtflh: "",
        acqTime: "",
        acqUser: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 3,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      },
      form5: {
        acqTime: "",
        acqUser: "",
        caseParticipants: "",
        caseFirstdone: "",
        caseKey: "",
        caseFile: "",
        caseTitle: "",
        caseType: null,
        dataOne: "2",
        dataTwo: "",
        menuId: 2,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      },
      form6: {
        acqTime: "",
        acqUser: "",
        patentAbstract: "",
        patentApplyMan: "",
        patentApplyNumber: "",
        patentApplyTime: "",
        patentAward: "2",
        patentAwardFile: "",
        patentFile: "",
        patentFirstDone: "",
        patentKey: "",
        patentMainType: "",
        patentName: "",
        patentParticipants: "",
        patentSignature: "",
        patentType: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 5,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      },
      form6list: {
        patentName: [
          { required: true, message: "请输入知识产权标题", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ]
      },
      // 新闻
      news: {},
      newslist: {
        // patentName: [{required: true, message: '请输入知识产权标题', trigger: 'blur'}],
      },
      // 标准
      standard: {
        standardName: "",
        standardType: "",
        standardKey: "",
        standardAbstract: "",
        standardNumber: "",
        issueDate: "",
        implementDate: "",
        issueCompany: "",
        publishCompany: "",
        standardTypeNumber: "",
        draftsman: "",
        standardSignature: "",
        standardFirstDone: "",
        standardParticipants: "",
        acqTime: "",
        acqUser: "",
        standardFile: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 6,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      },
      standardlist: {
        standardName: [
          { required: true, message: "请输入标准名称", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ]
      },
      // 实验室
      lab: {
        libTitle: "",
        libAchievement: "",
        libAchievementTime: "",
        libKey: "",
        libChargePerson: "",
        libAchievementApply: "",
        libAchievementParticipants: "",
        chargePerson: "",
        acqTime: "",
        acqUser: "",
        libFile: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 7,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      },
      lablist: {
        libTitle: [
          { required: true, message: "请输入实验室名称", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ]
      },
      // 图片
      orgList: [],
      picture: {
        picName: "",
        picKey: "",
        picDescribe: "",
        shotDate: "",
        copyright: "",
        orgId: null,
        picSignature: "",
        picFirstDone: "",
        picParticipants: "",
        acqTime: "",
        acqUser: "",
        picFile: "",
        depId: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 8,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      },
      picturelist: {
        picName: [
          { required: true, message: "请输入图片名称", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ]
        // depId: [{required: true, message: '请选择部门', trigger: 'blur'}],
      },
      // 视频
      picList: [],
      videoForm: {
        videoName: "",
        videoKey: "",
        videoSignature: "",
        videoFirstDone: "",
        videoParticipantsl: "",
        videoDescribe: "",
        shotDate: "",
        chargePerson: "",
        acqTime: "",
        acqUser: "",
        videoFile: "",
        depId: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 9,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      },
      videoFormlist: {
        // depId:[{required: true, message: '请选择部门', trigger: 'blur'}],
        videoName: [
          { required: true, message: "请输入视频名称", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ]
      },
      importForm: {
        dataOne: "2",
        importTitle:'',
        importKey:'',
        importFile: "",
        fileSize: null,
        fileName: "",
        fileDirs: [],
        dataTwo: "",
        menuId: 17,
        fileLists: []
      },
      importFormlist: {
        importTitle: [
          { required: true, message: "请输入题目", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ]
      },
      researchForm: {
        dataOne: "2",
        researchTitle:'',
        researchKey:'',
        researchFile: "",
        fileSize: null,
        fileName: "",
        fileDirs: [],
        dataTwo: "",
        menuId: 18,
        fileLists: []
      },
      researchFormlist: {
        researchTitle: [
          { required: true, message: "请输入题目", trigger: "blur" },
          { validator: typePureSpace, message: "输入不可以为纯空格", trigger: "blur" }
        ]
      },
      headerType: { "Content-Type": "multipart/form-data" },
      filesList: [],
      uploadlist: [],
      oldFilesList: [],
      successFiles: [],
      btnType: 0,
      fileNum: 0,
      // 知识产权专利
      isZhuanLi: true,
      result: {
        fileUrl: "",
        fileName: "",
        fileSize: null,
        fileDirs: [],
        oldFilesList: this.oldFilesList
      },
    };
  },
  filters: {
    fileIcon(val) {
      let value = val.toLocaleLowerCase()
      let fileText = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(value)
      let fileImg = /\.(png|jpg|jpeg|gif|bmp)(\?.*)?$/.test(value)
      let fileVideo = /\.(mp4|rmvb|mkv|wmv|flv|mov)(\?.*)?$/.test(value)
      if(fileImg) {
        return 'file_img'
      } else
      if(fileVideo) {
        return 'file_video'
      } else {
        return 'file_text'
      }
    }
  },
  mounted() {
    this.getOrgList();
    this.getLeftTreeData();
    this.EchoDisplay();
    Bus.$on("fileAddFolder", data => {
      this.btnType = data;
    });
    // 文件选择后的回调
    Bus.$on("fileAdded", (res, state) => {
      if (res instanceof Array) {
        this.filesList = res;
        if(this.btnType == 1 && state == 'add') {
          this.fileNum++;
          this.open(this.fileNum);
        }
        if(state == 'remove' && this.successFiles.length != 0) {
          let removeFiles = this.removeFile(this.filesList, this.successFiles);
          removeFiles.forEach(item => {
            this.successFiles.splice(this.successFiles.findIndex((v) => v.fileName == item.fileName), 1);
            this.result.fileDirs.splice(this.result.fileDirs.findIndex((v) => v.filename == item.fileName), 1);
          })
        }
      }
    });
  },
  methods: {
    EchoDisplay() {
      getresource(this.datas).then(res => {
        if (res.data.code == 1) {
          let resObj = res.data.data;
          console.log(resObj);
          if(resObj.dataThree == null) return this.$message.warning("所属资源目录层级为空，此条数据有误！");
          // 获取所属资源目录
          getFromMenuId(resObj.dataThree).then(result => {
            if(result.data.code == 1) {
              this.values = result.data.data.menuArray.split(",").map(item => {
                return Number(item);
              });
              this.value = result.data.data.menuId;
              switch (this.value) {
                case 1:
                  this.form2 = { ...this.form2, ...resObj };
                  break;
                case 2:
                  this.form5 = { ...this.form5, ...resObj };
                  break;
                case 3:
                  this.form3 = { ...this.form3, ...resObj };
                  break;
                case 4:
                  this.form4 = { ...this.form4, ...resObj };
                  break;
                case 5:
                  this.form6 = { ...this.form6, ...resObj };
                  if(this.form6.patentType == 1) {
                    this.tchange(1);
                  } else {
                    this.tchange(2);
                  }
                  break;
                case 6:
                  this.standard = { ...this.standard, ...resObj };
                  break;
                case 7:
                  this.lab = { ...this.lab, ...resObj };
                  break;
                case 8:
                  this.picture = { ...this.picture, ...resObj };
                  break;
                case 9:
                  this.videoForm = { ...this.videoForm, ...resObj };
                  break;
                case 10:
                  this.news = { ...this.news, ...resObj };
                  break;
                case 17:
                  this.importForm = { ...this.importForm, ...resObj };
                  break;
                case 18:
                  this.researchForm = { ...this.researchForm, ...resObj };
                  break;
                default:
              }
              this.sel(this.value);
            } else {
              this.$message.error(result.data.msg);
            }
          })
          // 获取文件列表
          let filesParam = {
            menuId: resObj.dataThree,
            resourceId: this.datas.resourceId,
            type: this.datas.type
          };
          getreSourceFiles(filesParam).then(res => {
            console.log(res.data.data);
            if (res.data.code == 1) {
              this.oldFilesList = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          });
          // 获取标签内容
          if(resObj.dataTwo !== "") {
            getLabels(resObj.dataTwo).then(data => {
              if (data.data.code == 1) {
                console.log(data);
                this.tags = data.data.data.map(item => {
                  return {
                    name: item.TYPENAME,
                    type: "",
                    id: item.LABELID
                  };
                });
                console.log(this.tags);
                this.tallyNameArr = data.data.data.map(item => {
                  return item.TYPENAME.split(":")[1];
                });
                this.tallyValueArr = data.data.data.map(item => {
                  return item.LABELID;
                });
              }
            });
          }
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    // 文件夹文件条数提醒
    open(num) {
      if(num >= 20) {
        this.$confirm(`此文件夹将有${num}条文件上传到系统。`, '提示', {
          confirmButtonText: '确定',
          type: 'info'
        }).then(() => {
          this.fileNum = 0;
        })
      }
    },
    isInArray2(arr, value) {
      for (var i = 0; i < arr.length; i++) {
        if ( value.filename === arr[i].filename && value.relativePath === arr[i].relativePath) {
          return true;
        }
      }
      return false;
    },
    uploadFileList() {
      const that = this;
      return new Promise((resolve, reject) => {
        if(this.oldFilesList.length == 0 && this.filesList.length == 0) {
          return reject("文件不能为空，请选择文件！");
        }
        if (this.filesList.length == 0) {
          this.result.oldFilesList = this.oldFilesList;
          return resolve(this.result);
        } else {
          let warmsg = "";
          let array = [];
          array = this.filesList.filter((item, index) => {
            let i = null;
            this.oldFilesList.forEach((item1, index1) => {
              if (item.name === item1.fileName) {
                i = index;
              }
            });
            if (i == index) {
              return item;
            }
          });
          if (array.length != 0) {
            warmsg = array
              .map(item => {
                return item.name;
              })
              .join("、");
            return reject(`【${warmsg}】等文件重复，请选择删除其中一条！`);
          } else {
            this.result.oldFilesList = this.oldFilesList;
          }
        }
        Bus.$emit("submitFile");
        this.fileLoading = true;
        // 单个文件上传成功的监听
        Bus.$on("fileSuccess", (res, arr, ressize) => {
          if(res == null) return;
          this.successFiles.push(res);
          if(this.uploadlist.length == 0) {
            this.uploadlist = arr;
          }
          let url;
          let ss = {
            filename: "",
            relativePath: "",
            fileUrl: ""
          }
          this.uploadlist.forEach(item => {
            if (item.name == res.fileName) {
              ss.filename = res.fileName;
              ss.fileUrl = res.fileUrl;
              ss.relativePath = item.relativePath;
            }
          });
          if(this.isInArray2(this.result.fileDirs,ss)){
          }else{
            this.result.fileDirs.push(ss);
          }
        });
        // 上传进度监听
        Bus.$on("fileProgress", resul => {
          this.progress = resul + "%";
        });
        // 所有文件上传完成的监听
        Bus.$on("fileComplete", (size, files) => {
          this.fileLoading = false;
          setTimeout(() => {
            // 已上传成功的文件数 和 返回的总文件数相同 才算成功
            console.log(this.successFiles, this.uploadlist, this.result, 88888888888);
            if (this.successFiles.length == this.uploadlist.length) {
              let Size = Math.round((size / 1024 / 1024) * 10000) / 10000;
              this.result.fileSize = Size;
              this.result.oldFilesList = this.oldFilesList;
              this.fileLoading = false;
              if(this.result.fileDirs.length == 0) {
                return reject(`文件传参失败！`);
              } else {
                return resolve(this.result);
              }
            } else if(this.progress == '100%'){
              this.fileLoading = false;
              return reject(`文件上传失败！`);
            }
          }, 2000);
        });
        Bus.$on("fileError", file => {
          this.$message.error(`${file.name}上传失败，请删除失败文件，重新点击提交。`)
        })
      });
    },
    removeFile(added, suc) {
      let arr = []
      suc.forEach(item => {
        let isInner = true;
        added.forEach(file => {
          if(file.name == item.fileName) {
            isInner = false;
          }
        })
        if(isInner) arr.push(item);
      })
      return arr;
    },
    // 获得不重复的，即没有上传成功的文件
    getFailFile(suc, all) {
      console.log(suc, all);
      let arr = all.filter(item => {
        let temp = true;
        suc.forEach(val => {
          if(item.relativePath == val.relativePath) {
            temp = false;
          }
        })
        if(temp) {
          return item;
        }
      })
      return arr;
    },
    // 删除已有列表中的某一项
    delFile(index) {
      this.oldFilesList.splice(index, 1);
    },
    // 文件上传成功回调
    upload1(response) {},
    beforeChange(fileList) {},
    beforeFileUpload(file) {},
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    handleProgress(event, file, fileList) {},

    // 上传钩子函数结束》
    // 以下为三个库的附加材料上传
    lunwen2() {
      this.$refs.lunwen2.submit();
    },
    chengguo2() {
      this.$refs.chengguo2.submit();
    },
    zhishichanquan2() {
      this.$refs.zhishichanquan2.submit();
    },

    upload2(response, file, fileList) {
      if (response.code == 1 && null != response.data) {
        this.form2.thesisEvidence = response.data.fileUrl;
        this.$alert("上传成功", "提示", {
          type: "success"
        });
        this.$refs.lunwen2.disabled = true;
        document.getElementById("aw1").classList.add("is-disabled");
        document.getElementById("aw2").classList.add("is-disabled");
      } else {
        this.$alert(response.msg, "提示", {
          type: "error"
        });
      }
    },
    upload5(response, file, fileList) {
      if (response.code == 1 && null != response.data) {
        this.form3.achiEvidence = response.data.fileUrl;
        this.$alert("上传成功", "提示", {
          type: "success"
        });
        this.$refs.chengguo2.disabled = true;
        document.getElementById("cw1").classList.add("is-disabled");
        document.getElementById("cw2").classList.add("is-disabled");
        // var aDiv2=document.getElementsByClassName("el-icon-close")
        // for (var i = 0;i<aDiv2.length;i++) {
        //   aDiv2[i].style.display="none";
        // };
      } else {
        this.$alert(response.msg, "提示", {
          type: "error"
        });
      }
    },
    // 知识产权
    upload8(response, file, fileList) {
      if (response.code == 1 && null != response.data) {
        this.form6.patentAwardFile = response.data.fileUrl;
        this.$alert("上传成功", "提示", {
          type: "success"
        });
        this.$refs.zhishichanquan2.disabled = true;
        document.getElementById("xw1").classList.add("is-disabled");
        document.getElementById("xw2").classList.add("is-disabled");
        // var aDiv2=document.getElementsByClassName("el-icon-close")
        // for (var i = 0;i<aDiv2.length;i++) {
        //   aDiv2[i].style.display="none";
        // };
      } else {
        this.$alert(response.msg, "提示", {
          type: "error"
        });
      }
    },

    // 以下add...函数为各库点击提交
    resetRelunwen() {
      let _this = this;
      this.$refs.form2.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.form2.thesisFile = response.fileUrl;
              this.form2.fileName = response.fileName;
              this.form2.fileSize = response.fileSize;
              this.form2.fileDirs = response.fileDirs;
              this.form2.fileLists = response.oldFilesList;
              if (
                this.form2.thesisEvidence == "" &&
                this.form2.thesisAward == 1
              ) {
                this.$alert("请上传证明材料", "提示", {
                  type: "error"
                });
                return false;
              }
              console.log(this.form2);
              resetRelunwen(this.form2).then(function(res) {
                if (res.data.code == 1) {
                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该论文标题已存在", "提示", {
                      type: "error"
                    });
                  } else {
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              this.$message.warning(err);
            });
        } else {
          return false;
        }
      });
    },

    resetReanliku() {
      var _this = this;
      this.$refs.form5.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.form5.caseFile = response.fileUrl;
              this.form5.fileName = response.fileName;
              this.form5.fileSize = response.fileSize;
              this.form5.fileDirs = response.fileDirs;
              this.form5.fileLists = response.oldFilesList;
              resetReanliku(this.form5).then(function(res) {
                if (res.data.code == 1) {
                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该案例标题已存在", "提示", {
                      type: "error"
                    });
                  } else {
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              this.$message.warning(err);
            });
        } else {
          return false;
        }
      });
    },
    resetRezhishichanquan() {
      var _this = this;
      this.$refs.form6.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.form6.patentFile = response.fileUrl;
              this.form6.fileName = response.fileName;
              this.form6.fileSize = response.fileSize;
              this.form6.fileDirs = response.fileDirs;
              this.form6.fileLists = response.oldFilesList;
              if (
                this.form6.patentAwardFile == "" &&
                this.form6.patentAward == 1
              ) {
                this.$alert("请上传证明材料", "提示", {
                  type: "error"
                });
                return false;
              }
              resetRezhishichanquan(this.form6).then(function(res) {
                if (res.data.code == 1) {
                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该知识产权标题已存在", "提示", {
                      type: "error"
                    });
                  } else {
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              this.$message.warning(err);
            });
        } else {
          return false;
        }
      });
    },
    resetRechengguo() {
      var _this = this;
      this.$refs.form3.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.form3.achiFile = response.fileUrl;
              this.form3.fileName = response.fileName;
              this.form3.fileSize = response.fileSize;
              this.form3.fileDirs = response.fileDirs;
              this.form3.fileLists = response.oldFilesList;
              if (this.form3.achiEvidence == "" && this.form3.achiAward == 1) {
                this.$alert("请上传证明材料", "提示", {
                  type: "error"
                });
                return false;
              }
              resetRechengguo(this.form3).then(function(res) {
                if (res.data.code == 1) {
                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该成果标题已存在", "提示", {
                      type: "error"
                    });
                  } else {
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              this.$message.warning(err);
            });
        } else {
          return false;
        }
      });
    },
    resetRebook() {
      var _this = this;
      this.$refs.form4.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.form4.booksFile = response.fileUrl;
              this.form4.fileName = response.fileName;
              this.form4.fileSize = response.fileSize;
              this.form4.fileDirs = response.fileDirs;
              this.form4.fileLists = response.oldFilesList;
              resetRebook(this.form4).then(function(res) {
                if (res.data.code == 1) {
                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该图书标题已存在", "提示", {
                      type: "error"
                    });
                  } else {
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              this.$message.warning(err);
            });
        } else {
          return false;
        }
      });
    },
    // 添加新闻  --先不做
    addxinwen() {
      this.$refs.news.validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
    // 标准 上传
    resetRestandard() {
      var _this = this;
      this.$refs.standard.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.standard.standardFile = response.fileUrl;
              this.standard.fileName = response.fileName;
              this.standard.fileSize = response.fileSize;
              this.standard.fileDirs = response.fileDirs;
              this.standard.fileLists = response.oldFilesList;
              resetRestandardInterface(this.standard).then(function(res) {
                if (res.data.code == 1) {
                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该标准标题已存在", "提示", {
                      type: "error"
                    });
                  } else {
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              this.$message.warning(err);
            });
        } else {
          return false;
        }
      });
    },
    // 实验室 上传
    resetRelab() {
      var _this = this;
      this.$refs.lab.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.lab.libFile = response.fileUrl;
              this.lab.fileName = response.fileName;
              this.lab.fileSize = response.fileSize;
              this.lab.fileDirs = response.fileDirs;
              this.lab.fileLists = response.oldFilesList;
              resetRelabInterface(this.lab).then(function(res) {
                if (res.data.code == 1) {
                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该标准标题已存在", "提示", {
                      type: "error"
                    });
                  } else {
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              this.$message.warning(err);
            });
        } else {
          return false;
        }
      });
    },
    // 图片 上传
    resetRepicture() {
      var _this = this;
      this.$refs.picture.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.picture.picFile = response.fileUrl;
              this.picture.fileName = response.fileName;
              this.picture.fileSize = response.fileSize;
              this.picture.fileDirs = response.fileDirs;
              this.picture.fileLists = response.oldFilesList;
              resetRepictureInterface(this.picture).then(function(res) {
                if (res.data.code == 1) {
                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该标准标题已存在", "提示", {
                      type: "error"
                    });
                  } else {
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              this.$message.warning(err);
            });
        } else {
          return false;
        }
      });
    },
    // 图片-组织机构获取值
    getPicOrg(parm) {
      // this.picture.depId = parm;
    },
    // 组织结构初始化
    getOrgList() {
      getOrgListInterface().then(res => {
        this.orgList = res.data.data;
        this.picList = res.data.data;
      });
    },
    // 视频 上传
    resetRevideoForm() {
      var _this = this;
      this.$refs.videoForm.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.videoForm.videoFile = response.fileUrl;
              this.videoForm.fileName = response.fileName;
              this.videoForm.fileSize = response.fileSize;
              this.videoForm.fileDirs = response.fileDirs;
              this.videoForm.fileLists = response.oldFilesList;
              // if(this.videoForm.depId != null && this.videoForm.depId.length > 0){
              //   this.videoForm.depId = this.videoForm.depId[this.videoForm.depId.length-1]
              // }
              resetRevideoFormInterface(this.videoForm).then(function(res) {
                if (res.data.code == 1) {
                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该视频标题已存在", "提示", {
                      type: "error"
                    });
                  } else {
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              this.$message.warning(err);
            });
        } else {
          return false;
        }
      });
    },
    // 重要文件上传
    resetReImportForm() {
      var _this = this;
      this.$refs.importForm.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.importForm.importFile = response.fileUrl;
              this.importForm.fileName = response.fileName;
              this.importForm.fileSize = response.fileSize;
              this.importForm.fileDirs = response.fileDirs;
              this.importForm.fileLists = response.oldFilesList;

              resetReimportFormInterface(this.importForm).then(function(res) {
                if (res.data.code == 1) {
                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该文件标题已存在", "提示", {
                      type: "error"
                    });

                  } else {
                    _this.$alert(res.data.msg,"提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              this.$message.warning(err);
            });
        } else {
          return false;
        }
      });
    },
    //行研报告上传
    resetReResearchForm(){
      var _this = this;
      this.$refs.researchForm.validate(valid => {
        if (valid) {
          this.uploadFileList()
            .then(response => {
              this.researchForm.researchFile = response.fileUrl;
              this.researchForm.fileName = response.fileName;
              this.researchForm.fileSize = response.fileSize;
              this.researchForm.fileDirs = response.fileDirs;
              this.researchForm.fileLists = response.oldFilesList;
              resetReresearchFormInterface(this.researchForm).then(function(res) {
                if (res.data.code == 1) {

                  _this
                    .$alert("提交成功", "提示", {
                      type: "success"
                    })
                    .then(() => {
                      _this.$store.commit("setDialog", 1);
                    });
                  _this.clear();
                } else {
                  if (res.data.code == -2) {
                    _this.$alert("该报告标题已存在", "提示", {
                      type: "error"
                    });

                  } else {
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                  }
                }
              });
            })
            .catch(err => {
              _this.$message.error(`${err}将自动为您刷新页面，请重新上传。`);
            });
        } else {
          return false;
        }
      });
    },

    // 视频-组织机构获取值
    getVideoOrg(parm) {
      // this.videoForm.depId = parm;
    },

    lunwencailiao() {
      var res = this.form2.thesisAward;
      if (res == 1) {
        $("#lunwencailiao").css("display", "");
      }
      if (res == 2) {
        $("#lunwencailiao").css("display", "none");
      }
    },
    chengguocailiao() {
      var res = this.form3.achiAward;
      if (res == 1) {
        $("#cw").css("display", "");
      }
      if (res == 2) {
        $("#cw").css("display", "none");
      }
    },
    zhishichanquan() {
      var res = this.form6.patentAward;
      if (res == 1) {
        $("#xw").css("display", "");
      }
      if (res == 2) {
        $("#xw").css("display", "none");
      }
    },

    // 获取标签
    getLeftTreeData() {
      getlabelListAllData().then(res => {
        this.options = res.data.data[0].children;
        this.options[9].disabled = true;
      });
    },
    getTallyData1() {
      let menuIds = {
        menuIds: this.value
      };
      getTagListAllData(menuIds).then(res => {
        if (res.data.data) {
          this.tallyData.classify1 = res.data.data;
        }
      });
    },
    tabs(id) {
      let data = { labelTypeId: id, menuId: this.value.toString() };
      getTagcontentData(data).then(res => {
        let obj = {};
        obj = this.tallyData.classify1.find(item => {
          return item.id === id;
        });

        this.tallyName1 = obj.typeName;
        this.tallyData.classify2 = res.data.data;
      });
      this.tallyValue2 = "";
      this.tallyName2 = "";
    },
    tabsTwo(id) {
      let obj2 = {};
      obj2 = this.tallyData.classify2.find(item => {
        return item.id === id;
      });
      this.tallyName2 = obj2.labelName;
      // 判断添加的标签是否重复
      let temp = true;
      for (let i = 0; i < this.tallyNameArr.length; i++) {
        if (this.tallyName2 === this.tallyNameArr[i]) {
          temp = false;
        }
      }
      if (temp) {
        this.tallyValueArr.push(this.tallyValue2);
        switch (this.value) {
          case 1:
            this.form2.dataTwo = this.tallyValueArr.join(",");
            break;
          case 2:
            this.form5.dataTwo = this.tallyValueArr.join(",");
            break;
          case 3:
            this.form3.dataTwo = this.tallyValueArr.join(",");
            break;
          case 4:
            this.form4.dataTwo = this.tallyValueArr.join(",");
            break;
          case 5:
            this.form6.dataTwo = this.tallyValueArr.join(",");
            break;
          case 6:
            this.standard.dataTwo = this.tallyValueArr.join(",");
            break;
          case 7:
            this.lab.dataTwo = this.tallyValueArr.join(",");
            break;
          case 8:
            this.picture.dataTwo = this.tallyValueArr.join(",");
            break;
          case 9:
            this.videoForm.dataTwo = this.tallyValueArr.join(",");
            break;
          case 10:
            this.news.dataTwo = this.tallyValueArr.join(",");
            break;
          case 17:
            this.importForm.dataTwo = this.tallyValueArr.join(",");
            break;
          case 18:
            this.researchForm.dataTwo = this.tallyValueArr.join(",");
            break;
          default:
        }
        this.tallyNameArr.push(this.tallyName2);
        this.tags.push({
          name: this.tallyName1 + ":" + this.tallyName2,
          type: "success",
          id: id
        });
      } else {
        this.$message.warning("不可以重复提交");
        this.tallyName2 = "";
        this.tallyValue2 = "";
        // obj2 = {};
      }
    },
    handleCloseTag(tag) {
      let tagName = tag.name.split(":")[1];
      this.tallyNameArr.splice(this.tallyNameArr.indexOf(tagName), 1);
      this.tallyValueArr.splice(this.tallyValueArr.indexOf(tag.id), 1);
      console.log(this.tallyNameArr);
      this.tags.splice(this.tags.indexOf(tag), 1);
      switch (this.value) {
        case 1:
          this.form2.dataTwo = this.tallyValueArr.join(",");
          break;
        case 2:
          this.form5.dataTwo = this.tallyValueArr.join(",");
          break;
        case 3:
          this.form3.dataTwo = this.tallyValueArr.join(",");
          break;
        case 4:
          this.form4.dataTwo = this.tallyValueArr.join(",");
          break;
        case 5:
          this.form6.dataTwo = this.tallyValueArr.join(",");
          break;
        case 6:
          this.standard.dataTwo = this.tallyValueArr.join(",");
          break;
        case 7:
          this.lab.dataTwo = this.tallyValueArr.join(",");
          break;
        case 8:
          this.picture.dataTwo = this.tallyValueArr.join(",");
          break;
        case 9:
          this.videoForm.dataTwo = this.tallyValueArr.join(",");
          break;
        case 10:
          this.news.dataTwo = this.tallyValueArr.join(",");
          break;
        case 17:
          this.importForm.dataTwo = this.tallyValueArr.join(",");
          break;
        case 18:
          this.researchForm.dataTwo = this.tallyValueArr.join(",");
          break;
        default:
      }
    },

    sel(val) {
      $("#loc1").css("display", "none");
      $("#loc2").css("display", "none");
      $("#loc3").css("display", "none");
      $("#loc4").css("display", "none");
      $("#loc5").css("display", "none");
      $("#loc6").css("display", "none");
      $("#loc7").css("display", "none");
      $("#loc8").css("display", "none");
      $("#loc9").css("display", "none");
      $("#loc10").css("display", "none");
      $("#loc17").css("display", "none");
      $("#loc18").css("display", "none");
      if (val == 1) {
        var loc = document.getElementById("loc1");
        loc.style.cssText = "display:block";
      }
      if (val == 2) {
        var loc = document.getElementById("loc2");
        loc.style.cssText = "display:block";
      }
      if (val == 3) {
        var loc = document.getElementById("loc3");
        loc.style.cssText = "display:block";
      }
      if (val == 4) {
        var loc = document.getElementById("loc4");
        loc.style.cssText = "display:block";
      }
      if (val == 5) {
        var loc = document.getElementById("loc5");
        loc.style.cssText = "display:block";
      }
      if (val == 6) {
        var loc = document.getElementById("loc7");
        loc.style.cssText = "display:block";
      }
      if (val == 7) {
        var loc = document.getElementById("loc8");
        loc.style.cssText = "display:block";
      }
      if (val == 8) {
        var loc = document.getElementById("loc9");
        loc.style.cssText = "display:block";
      }
      if (val == 9) {
        var loc = document.getElementById("loc10");
        loc.style.cssText = "display:block";
      }
      if (val == 10) {
        var loc = document.getElementById("loc6");
        loc.style.cssText = "display:block";
      }
      if (val == 17) {
        var loc = document.getElementById("loc17");
        loc.style.cssText = "display:block";
      }
      if (val == 18) {
        var loc = document.getElementById("loc18");
        loc.style.cssText = "display:block";
      }
      this.getTallyData1();
    },

    review(file) {
      this.$emit('getfileInfo', file);
    },

    tchange(id) {
      if(id == 1) {
        this.isZhuanLi = true;
      } else {
        this.isZhuanLi = false;
      }
    },

    clear() {
      this.form2 = {
        thesisTitle: "",
        thesisKey: "",
        thesisType: null,
        thesisKh: "",
        thesisKwmc: "",
        thesisAbstract: "",
        thesisLiterature: "",
        thesisSubjectName: "",
        thesisWordCount: null,
        thesisPublishTime: "",
        thesisEvidence: "",
        thesisFirstDone: "",
        thesisParticipants: "",
        thesisSignature: "",
        thesisFile: "",
        acqTime: "",
        acqUser: "",
        thesisAward: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 1,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      };

      (this.form4 = {
        acqTime: "",
        acqUser: "",
        booksAbstract: "",
        booksAuthor: "",
        booksBumber: "",
        booksCompany: "",
        booksDoi: "",
        booksFile: "",
        booksFirstDone: "",
        booksGrade: "",
        booksKey: "",
        booksName: "",
        booksParticipants: "",
        booksPress: "",
        booksPublicTime: "",
        booksSignature: "",
        booksType: null,
        booksTypeNumber: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 4,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      }),
        (this.form3 = {
          achiAbstract: "",
          achiAward: "2",
          achiBdfs: "",
          achiBdsj: "",
          achiEvidence: "",
          achiFbsj: "",
          achiFile: "",
          achiFirstDone: "",
          achiHddd: "",
          achiHdnr: "",
          achiHdsj: "",
          achiJldd: "",
          achiJlsj: "",
          achiKey: "",
          achiKh: "",
          achiKwmc: "",
          achiMtpt: "",
          achiParticipants: "",
          achiPsld: "",
          achiSignature: "",
          achiTitle: "",
          achiType: null,
          achiWordCount: "",
          achiXkflh: "",
          achiZtflh: "",
          acqTime: "",
          acqUser: "",
          dataOne: "2",
          dataTwo: "",
          menuId: 3,
          fileSize: null,
          fileName: "",
          fileDirs: [],
          fileLists: []
        }),
        (this.form5 = {
          acqTime: "",
          acqUser: "",
          caseParticipants: "",
          caseFirstdone: "",
          caseKey: "",
          caseFile: "",
          caseTitle: "",
          caseType: null,
          dataOne: "2",
          dataTwo: "",
          menuId: 2,
          fileSize: null,
          fileName: "",
          fileDirs: [],
          fileLists: []
        }),
        (this.form6 = {
          acqTime: "",
          acqUser: "",
          patentAbstract: "",
          patentApplyMan: "",
          patentApplyNumber: "",
          patentApplyTime: "",
          patentAward: "2",
          patentAwardFile: "",
          patentFile: "",
          patentFirstDone: "",
          patentKey: "",
          patentMainType: "",
          patentName: "",
          patentParticipants: "",
          patentSignature: "",
          patentType: "",
          dataOne: "2",
          dataTwo: "",
          menuId: 5,
          fileSize: null,
          fileName: "",
          fileDirs: [],
          fileLists: []
        }),
        this.$refs["lunwen2"].clearFiles();
      this.$refs.lunwen2.disabled = false;

      this.$refs["chengguo2"].clearFiles();
      this.$refs.chengguo2.disabled = false;

      this.$refs["zhishichanquan2"].clearFiles();
      this.$refs.zhishichanquan2.disabled = false;

      document.getElementById("aw1").classList.remove("is-disabled");
      document.getElementById("aw2").classList.remove("is-disabled");

      document.getElementById("cw1").classList.remove("is-disabled");
      document.getElementById("cw2").classList.remove("is-disabled");

      document.getElementById("xw1").classList.remove("is-disabled");
      document.getElementById("xw2").classList.remove("is-disabled");
      // 标准
      this.standard = {
        standardName: "",
        standardType: "",
        standardKey: "",
        standardAbstract: "",
        standardNumber: "",
        issueDate: "",
        implementDate: "",
        issueCompany: "",
        publishCompany: "",
        standardTypeNumber: "",
        draftsman: "",
        standardSignature: "",
        standardFirstDone: "",
        standardParticipants: "",
        acqTime: "",
        acqUser: "",
        standardFile: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 6,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      };
      // 实验室
      this.lab = {
        libTitle: "",
        libAchievement: "",
        libAchievementTime: "",
        libKey: "",
        libChargePerson: "",
        libAchievementApply: "",
        libAchievementParticipants: "",
        chargePerson: "",
        acqTime: "",
        acqUser: "",
        libFile: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 7,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      };

      // 图片
      this.picture = {
        picName: "",
        picKey: "",
        picDescribe: "",
        shotDate: "",
        copyright: "",
        orgId: null,
        picSignature: "",
        picFirstDone: "",
        picParticipants: "",
        acqTime: "",
        acqUser: "",
        picFile: "",
        depId: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 8,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      };
      // 视频
      this.videoForm = {
        videoName: "",
        videoKey: "",
        videoSignature: "",
        videoFirstDone: "",
        videoParticipantsl: "",
        videoDescribe: "",
        shotDate: "",
        chargePerson: "",
        acqTime: "",
        acqUser: "",
        videoFile: "",
        depId: "",
        dataOne: "2",
        dataTwo: "",
        menuId: 9,
        fileSize: null,
        fileName: "",
        fileDirs: [],
        fileLists: []
      };
      //文件
      this.importForm = {
        dataOne: "2",
        importTitle:'',
        importKey:'',
        importFile: "",
        fileSize: null,
        fileName: "",
        fileDirs: [],
        dataTwo: "",
        menuId: 17,
        fileLists: []
      };
      //报告
      this.researchForm = {
        dataOne: "2",
        researchTitle:'',
        researchKey:'',
        researchFile: "",
        fileSize: null,
        fileName: "",
        fileDirs: [],
        dataTwo: "",
        menuId: 18,
        fileLists: []
      };

      $("#lunwencailiao").css("display", "none");
      $("#cw").css("display", "none");
      $("#xw").css("display", "none");
      // 标签
      this.tallyValue1 = "";
      this.tallyValue2 = "";
      this.tallyValueArr = [];
      this.tallyName1 = "";
      this.tallyName2 = "";
      this.tallyNameArr = [];
      this.tags = [];
      this.tallyData.classify1 = [];
      this.tallyData.classify2 = [];
    }
  },
  destroyed() {
    Bus.$off("fileAdded");
    Bus.$off("fileSuccess");
    Bus.$off("fileComplete");
    Bus.$off("fileProgress");
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.file_list li {
  margin: 0 !important;
  padding-right: 4px !important;
}

.tag-hidden {
  display: none;
}

.file_list {
  width: 100%;
  border: 1px solid #ddd;
  li {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    padding: 0 4px;
    display: flex;
    align-items: center;
    span {
      height: 30px;
    }&:nth-child(even) {
      background-color: #f3f3f3;
    }
  }
  li:hover {
    background-color: #fafafa;
  }

  .file_text {
    background: url(./images/text-icon.png) no-repeat center;
  }
  .file_img {
    background: url(./images/image-icon.png) no-repeat center;
  }
  .file_video {
    background: url(./images/video-icon.png) no-repeat center;
  }
  .file_text, .file_img, .file_video {
    display: inline-block;
    width: 6%;
    background-size: 14px;
  }

  .file_name {
    display: inline-block;
    width: 86%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .file_actions {
    cursor: pointer;
    display: inline-block;
    width: 5%;
    text-align: left;
    i {
      vertical-align: middle;
    }
    i:hover {
      color: #009A52;
    }
  }

  .file_close{
    cursor: pointer;
    display: inline-block;
    i {
      vertical-align: middle;
    }
  }
  .el-icon-close {
    display: inline-block;
    width: 16px;
    height: 16px;
    font-size: 16px;
    font-weight: 700;
    color: #888;
    cursor: pointer;
  }
}
</style>
